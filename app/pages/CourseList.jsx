import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getCourseList } from '../Services/index.js';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CourseList({ level, searchQuery }) { // Accept searchQuery as a prop
  const navigation = useNavigation();
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // Filtered courses state

  useEffect(() => {
    getCourses();
  }, []); // To run the function only once when the component mounts

  useEffect(() => {
    filterCourses(); // Re-filter courses when searchQuery changes
  }, [searchQuery, courseList]);

  const getCourses = () => {
    getCourseList(level).then((resp) => {
      setCourseList(resp?.data?.courses || []); // Set courses when fetched
    });
  };

  const filterCourses = () => {
    const filtered = courseList.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter courses based on the search query
    );
    setFilteredCourses(filtered); // Update the filtered courses state
  };

  const coursesToDisplay = searchQuery.length !== 0 ? filteredCourses : courseList;

  return (
    <View style={{ padding: 15 }}>
        {coursesToDisplay.length > 0 ? (
        <Text style={{ fontSize: 27, fontFamily: 'RowdiesRegular' }}>
          {level.charAt(0).toUpperCase() + level.slice(1)} Courses
        </Text>
      ) : ""}
      <FlatList
        data={filteredCourses} // Display filtered courses
        keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('course-detail', {
                  course: item,
                })
              }
            >
              <View
                style={{
                  padding: 10,
                  margin: 15,
                  borderRadius: 15,
                  backgroundColor: '#CEB9C4',
                  width: 230,
                  height: 250, // Set a fixed height
                }}
              >
                <Image
                  source={{ uri: item.picture?.[0]?.url || '' }}
                  style={{ width: 210, height: 120, borderRadius: 15 }}
                />
                <View style={{ paddingTop: 7, paddingVertical: 10, paddingHorizontal: 4 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      textAlign: 'left',
                      fontFamily: 'RubikBold',
                    }}
                    numberOfLines={2} // Limit to 2 lines to prevent overflow
                    ellipsizeMode="tail" // Add "..." if the text exceeds the line limit
                  >
                    {item.name}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 10,
                      paddingTop: 3,
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <Ionicons name="book-outline" size={18} color="black" />
                      <Text style={{ fontFamily: 'RubikMedium' }}>
                        {item?.chapters?.length || 0} Chapters
                      </Text>
                    </View>
                    <View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Ionicons name="time-outline" size={18} color="black" />
                        <Text style={{ fontFamily: 'RubikMedium' }}>
                          {item?.time || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        marginTop: 5,
                        paddingLeft: 5,
                        fontFamily: 'RubikMedium',
                      }}
                    >
                      {item.price === 0 ? 'Free' : `$ ${item.price}`}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
