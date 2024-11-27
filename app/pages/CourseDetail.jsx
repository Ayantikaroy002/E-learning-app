import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, ToastAndroid, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { enrolledCourse, enrolledCoursesList, markChapterCompleted } from '../Services/index.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { CompletedChapterContext } from '../Context/CompletedChapter.js';
import { OngoingChapterContext } from '../Context/OngoingChapter.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CourseDetail() {
  const navigate = useNavigation();
  const [UserEnrolledCourseList, setUserEnrolledCourseList] = useState([]);
  const { isChapterCompleted, setIsChapterCompleted } = useContext(CompletedChapterContext);
  const { isChapterOngoing, setIsChapterOngoing} = useContext(OngoingChapterContext); // Track ongoing chapter
  const { params } = useRoute();
  const { user } = useUser();
  const course = params?.course;
  const chapters = course?.chapters;
  

  useEffect(() => {
    if (user && course) {
      GetUserEnrolledCourse(); // If a user navigates to a different course or if the user data updates this hook ensures the component re-fetches the enrollment status for the new course and user.
    }
  }, [course, user]);

  useEffect(() => {
    if (isChapterCompleted) {
      GetUserEnrolledCourse();
      setIsChapterCompleted(false); // Reset the context state
    }
  }, [isChapterCompleted]);

  useEffect(() => {
    const loadOngoingChapter = async () => {
      const savedChapterId = await AsyncStorage.getItem('ongoingChapterId');
      if (savedChapterId) {
        setIsChapterOngoing(parseInt(savedChapterId, 10)); // Restore ongoing chapter
      }
    };
    loadOngoingChapter();
}, []);

  const UserEnrollCourse = async () => {
    try {
      const resp = await enrolledCourse(course.id, user.primaryEmailAddress.emailAddress);
      await GetUserEnrolledCourse(); // Refresh enrollment status
    } catch (error) {
      console.error('Enrollment error:', error);
    }
  };

  const GetUserEnrolledCourse = async () => {
    try {
      const resp = await enrolledCoursesList(course.id, user.primaryEmailAddress.emailAddress);
      const enrolledCourses = resp.data?.userEnrolledCourses || [];
      setUserEnrolledCourseList(enrolledCourses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const onChapterFinished = async (chapterId) => {
    try {
      const resp = await markChapterCompleted(chapterId, UserEnrolledCourseList[0]?.id);
      if (resp) {
        await GetUserEnrolledCourse();
        setIsChapterCompleted(true);
        await AsyncStorage.removeItem('ongoingChapterId'); // Clear ongoing chapter
        ToastAndroid.show('Congratulations!!! You have completed the chapter', ToastAndroid.LONG);
        navigate.goBack();
      }
    } catch (error) {
      console.error('Error completing chapter:', error);
    }
  };

  const checkChapterCompleted = (chapterId) => {
    if (!UserEnrolledCourseList.length || !UserEnrolledCourseList[0]?.completedChapter) {
      return false;
    }
    return UserEnrolledCourseList[0].completedChapter.some(
      (item) => item.chapterId === chapterId
    );
  };

  const OnChapterPress = async (content, chapterId) => {
    if (UserEnrolledCourseList.length === 0) {
      ToastAndroid.show('Please Enroll in the Course !!!', ToastAndroid.LONG);
      return;
    } else {
      setIsChapterCompleted(false);
      setIsChapterOngoing(chapterId); // Set ongoing chapter
      await AsyncStorage.setItem('ongoingChapterId', chapterId.toString()); 
      await navigate.navigate('chapter', {
        content: content,
        onChapterFinished: () => onChapterFinished(chapterId),
      });
    }
  };

  return (
    <ScrollView style={{ padding: 20,  backgroundColor: '#C9C9C9' }}>
      <TouchableOpacity style={{ paddingBottom: 15 }} onPress={() => navigate.goBack()}>
        <Ionicons name="arrow-back-circle" size={40} color="#52011D" />
      </TouchableOpacity>
      {/* Course Detail Section */}
      <View style={{ backgroundColor: '#CEB9C4', padding: 13, paddingBottom: 20, borderRadius: 15 }}>
        <Image
          source={{ uri: course?.picture[0]?.url }}
          style={{
            width: Dimensions.get('screen').width * 0.82,
            height: 190,
            borderRadius: 15,
          }}
        />
        <Text style={{ fontSize: 25, marginTop: 10, fontFamily: 'RubikBold' }}>{course.name}</Text>
        <View>
          <Text style={{ fontSize: 20, marginTop: 7, marginLeft: 5, fontFamily: 'RowdiesRegular' }}>Course Description</Text>
          <Text style={{ marginLeft: 7, lineHeight: 20, fontFamily: 'ubuntuRegular' }}>{course?.description?.markdown}</Text>
        </View>
        <View>
          {UserEnrolledCourseList.length === 0 ? (
            <TouchableOpacity
              onPress={UserEnrollCourse}
              style={{
                padding: 15,
                borderRadius: 15,
                backgroundColor: '#710128',
                marginHorizontal: 19,
              }}
            >
              <Text style={{ textAlign: 'center', fontSize: 17, color: '#ffffff' }}>Enroll Now</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ textAlign: 'center', fontSize: 17, margin: 10, color: '#20580D', fontFamily: 'ubuntuMedium' }}>
              You are already enrolled in this course!!
            </Text>
          )}
        </View>
      </View>
      {/* Chapter Section */}
      <View style={{ padding: 15, marginTop: 15, marginBottom:35, borderRadius: 15,backgroundColor: '#CEB9C4' }}>
        <Text style={{ fontSize: 22, fontFamily: 'RowdiesRegular' }}>Chapters</Text>
        {chapters?.map((item, index) => {
          const words = item.title.split(' ');
          const truncatedTitle = words.length > 2 ? `${words.slice(0, 2).join(' ')}...` : item.title;
          return (
            <TouchableOpacity
              key={index}
              style={
                isChapterOngoing === item.id
                  ? styles.OngoingChapter
                  : checkChapterCompleted(item.id)
                  ? styles.CompletedChapter
                  : styles.inCompletedChapter
              }
              onPress={() => OnChapterPress(item.content, item.id)}
            >
              <Text style={{ fontSize: 20 }}>{index + 1}</Text>
              <Text style={{ fontSize: 15 }}>{truncatedTitle}</Text>
              { isChapterOngoing === item.id? 
              <Ionicons name="play-circle-outline" size={30} color="#8A3259" />:
              !checkChapterCompleted(item.id) ? (
                <Ionicons name="lock-closed-sharp" size={28} color="#5A5155" />
              ) : (
                <Ionicons name="checkmark-circle-sharp" size={30} color="#1B4A0B" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inCompletedChapter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#A2989C',
    borderColor: '#5A5155',
    borderWidth: 2,
  },
  CompletedChapter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#869C7D',
    borderColor: '#1B4A0B',
    borderWidth: 2,
  },
  OngoingChapter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#D297B2', 
    borderColor: '#8A3259',
    borderWidth: 2,
  },
});
