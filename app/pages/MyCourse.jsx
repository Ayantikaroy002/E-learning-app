import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { getAllEnrolledCourseProgress } from '../Services/index.js';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MyCourse() {
  const [courseProgress, setCourseProgress] = useState([]);
  const { user } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    user && GetAllEnrolledCourseProgress();
  }, [user]);

  const GetAllEnrolledCourseProgress = async () => {
    try {
      const resp = await getAllEnrolledCourseProgress(user.primaryEmailAddress.emailAddress);
      setCourseProgress(resp?.data?.userEnrolledCourses || []);
    } catch (error) {
      console.error('Enrollment error:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        GetAllEnrolledCourseProgress();
      }
    }, 36000); // Update every 36 seconds

    return () => clearInterval(interval); // Clean up the interval
  }, [user]);

  return (
    <View style={{ padding: 20, backgroundColor: '#C9C9C9' }}>
      <Text style={{ fontSize: 20, marginBottom: 15 }}>My Courses</Text>
      <FlatList
        data={courseProgress}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const course = item.course;
          const totalChapters = course.chapters?.length || 1;
          const completedChapters = item.completedChapter?.length || 0;
          const progressWidth = (completedChapters / totalChapters) * 100 + '%';

          return (
            <TouchableOpacity
              style={{ paddingVertical: 5 }}
              onPress={() =>
                navigation.navigate('home', {
                  screen: 'course-detail',
                  params: { course: course },
                })
              }
            >
              <View style={{ padding:17, marginRight: 15, borderRadius: 25, backgroundColor: '#CEB9C4', paddingBottom:35 }}>
                <Image
                  source={{ uri: course.picture[0].url }}
                  style={{ width: '100%', height: 170, borderRadius: 15 }}
                />
                <View style={{ padding: 7, paddingStart:-2 }}>
                  <Text style={{ fontSize:20,  paddingTop:5, textAlign: 'left',fontFamily: 'RubikBold', }} numberOfLines={2} // Limit to 2 lines to prevent overflow
      ellipsizeMode="tail"> {course.name} </Text>
                  <View style={{ flexDirection: 'row', gap:65, marginTop: 5, paddingBottom:10, paddingStart:10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="book-outline" size={18} color="black" />
                      <Text style={{fontSize:15, fontFamily: 'RubikMedium'}}> {course.chapters?.length || 0} Chapters </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="time-outline" size={18} color="black" />
                      <Text style={{fontSize:15, fontFamily: 'RubikMedium'}}> {course.time} </Text>
                    </View>
                  </View>
                </View>
                <View style={{paddingHorizontal:10}}>
                <View style={{ width: '100%', height: 7, borderRadius: 99, backgroundColor: '#000000', }}>
                  <View
                    style={{
                      width: progressWidth,
                      height: 7,
                      borderRadius: 99,
                      backgroundColor: '#228B22',
                    }}
                  />
                </View></View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
