import {
    View,
    Text,
    FlatList,
    Dimensions,
    useWindowDimensions,
    TouchableOpacity,
    ScrollView,
  } from 'react-native';
  import React, { useState } from 'react';
  import { useNavigation, useRoute } from '@react-navigation/native';
  import RenderHtml from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';
  
  export default function ChapterDetail() {
    const { width } = useWindowDimensions();
    const { params } = useRoute();
    const content = params?.content;
    const onChapterFinished = params?.onChapterFinished
    const arraySize = Array.from({ length: content.length }, (_, index) => index + 1);
    const contentIndex = nextContent;
    const [runStates, setRunStates] = useState({}); 
    const [nextContent, setNextContent] = useState(0); 
    let contentRef = null;
    const navigation = useNavigation();
    const onRunPress = (index) => {
      setRunStates((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    };
  
    const onNextPress = (currentIndex) => {
        if (content?.length <= currentIndex + 1) {
          //navigation.goBack();
          onChapterFinished()
          return;
        }
        setNextContent(currentIndex + 1); // Updating the nextContent state
        contentRef?.scrollToIndex({ animated: true, index: currentIndex + 1 });
      };
      
  
    return (
      content && (
        <ScrollView style={{ backgroundColor: '#C9C9C9'  }}>
            <View style={{marginBottom:10}}>
          {/* Progress Bar */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              padding: 20, 
            }}
          >
            {arraySize.map((item, index) => (
  <View
    key={index} 
    style={{
      backgroundColor: `${index <= nextContent ? '#FA2A76' : '#710128'}`, 
      
      borderRadius: 10,
      height: 10,
      margin: 5,
      flex: 1,
    }}
  />
))}

          </View>
  
          {/* Content FlatList */}
          <FlatList
            data={content}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={(ref) => {
              contentRef = ref;
            }}
            renderItem={({ item, index }) => {
              const descriptionHtml = {
                html: item.description.html,
              };
              const outputHtml = item.output?.html
                ? { html: item.output.html }
                : null;
  
              const tagsStyles = {
                body: {
                  fontSize: 18,
                  lineHeight: 26, 
                  
                },
                code: {
                  backgroundColor: '#000000',
                 
                  fontSize: 14,
                  padding: 20,
                  borderRadius: 15,
                  color: '#ffffff',
                  lineHeight: 28,
                },
              };
  
              return (
                <View style={{ width: Dimensions.get('screen').width, paddingStart:25, paddingEnd:10 }}>
                  <Text style={{ fontSize: 22, marginTop: 15, fontFamily:'RubikBold' }}>{item.heading}</Text>
                  <RenderHtml contentWidth={width} source={descriptionHtml} tagsStyles={tagsStyles} />
  
                  {/* Run Button */}
                  {outputHtml ? (
                    <>
                     <TouchableOpacity style={{ paddingBottom: 25, paddingStart:20 }} onPress={() => onRunPress(index)}>
  <View
    style={{
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 12,
      backgroundColor: '#710128',
      borderRadius: 10,
      width: 90, 
    }}
  >
    <Text
      style={{
        fontSize: 17,
        color: '#ffffff',
        textAlign: 'center',
        marginRight: 5, 
      }}
    >
      Run
    </Text>
    <Ionicons name="play" size={22} color="#ffffff" />
  </View>
</TouchableOpacity>

  
                      {/* Output */}
                      {runStates[index] ? (
                        <View style={{paddingStart:15,}}>
                          <Text style={{ marginTop: 10, fontSize: 22,  fontFamily:'RubikBold' }}>Output:</Text>
                          <RenderHtml contentWidth={width} source={outputHtml} tagsStyles={tagsStyles} />
                        </View>
                      ) : null}
                    </>
                  ) : (
                    <Text>Not Available</Text>
                  )}
  
                  {/* Next Button */}
                  <TouchableOpacity style={{paddingHorizontal:25}} onPress={() => onNextPress(index)}>
                  <View
    style={{
      flexDirection: 'row', // Arrange Text and Icon horizontally
      alignItems: 'center', // Center items vertically
      justifyContent: 'center', // Center items horizontally
     
      backgroundColor: '#710128',
      borderRadius: 10,
      // Adjusted width for better spacing
    }}
  >
                    <Text
                      style={{
                        padding: 13,
                        backgroundColor: '#710128',
                        color: '#ffffff',
                        
                        fontSize: 20,
                        
                      }}
                    >
                      {content?.length > index + 1 ? 'Next' : 'Finish'}
                    </Text>
                    <Ionicons name="play-forward" size={22} color="#ffffff" />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()} // Provide a unique key for FlatList
          /></View>
        </ScrollView>
      )
    );
  }
  