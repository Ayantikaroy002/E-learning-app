import { gql, request } from 'graphql-request'

const MASTER_URL = "https://ap-south-1.cdn.hygraph.com/content/cm398nqgs029z06wddkeyquum/master"



export const getCourseList = async (level) => {
    const query = gql`
 query CourseList {
  courses(where: {courseLevel: `+level+`}) {
    id
    name
    description {
      markdown
    }
    price
    tags
    time
    author
    courseLevel
    picture {
      url
    }
    chapters {
      id
      title
      content {
        heading
        description {
          markdown
          html
        }
        output {
          markdown
          html
        }
      }
    }
  }
} `

try {
  const response = await fetch(MASTER_URL, {
    method: 'POST',  // Changed to POST
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }), 
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors ? result.errors[0].message : "Network error");
  }

  
  return result;
} catch (error) {
  console.error("Error:", error.message);
}
};


export const enrolledCourse = async(courseId, userEmail)=> {
  const mutationQuery = gql`
  mutation MyMutation {
  createUserEnrolledCourse(
    data: {courseId: "`+courseId+`", userEmail: "`+userEmail+`", course: {connect: {id: "`+courseId+`"}}}
  ) {
    id
  }
  publishManyUserEnrolledCoursesConnection(to: PUBLISHED) {
    edges {
      node {
        id
      }
    }
  }
}`

try {
  const response = await fetch(MASTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MzE2NTg2NDIsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtMzk4bnFnczAyOXowNndkZGtleXF1dW0vbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiJiYzQ1NGM2NC1mMTUyLTRmZWYtODc0Yi1jZDJlYTM4OTMzOGQiLCJqdGkiOiJjbTNpZ3VmcHUwZnEyMDdwaTI0bXkzZHBwIn0.BWhHJORsVG-VzYIC6n12-Zc1gyRVs4nyfN4ZSnqeW9nY41a5Kg25XIoX8rS2ty0xDQn9iQBIq5alaxICTPk_6RWTZJMv_GOKIc5-Ng7XvAxWJLJNwZe3OklAmAeHWUr0IJ5SmltRoA_La_FLCgo91qkTlAxECSIGlkdbvA4kbi6b9AqFt27qSvLXaVJ_80V-QRQnyQAoz4zVuSdIztjYOa6wLgg-prnxj8cF-UZxqQZpE0lyVx8lUjhmOPFaJPZwm5gcKTVQ3mjMK430Wq245kenQcZQdUzbq92fxUxPwOHlPsxZxowdfu4xOiGgDKvQRHDrNCyfQPvOMhHLFhdSrjzc8zeerG4LkoBIXK_DaF4aaySn9JqzXb0IjncBTylMfUz3wi_XrfOffy9ObuDPDqwDa-wsD_RKqgvSV6QQjqRpwKXMGKoa7_cIBaTj5QfYZ_W_nUmNg7F_DrXHrhM8KmTFqGRHDEun3Fvs7aDeGGJ8UaCkun-sWJ_wYJgpxIKx1DMwSpz07-LP1YnSlRCgzcZDe7wcSgXNd6TCAS9PuHdp6-YzJmCxFhV5pNCNIaoO2P9JYVH1yC7z-KeqNKFx9Ujz-SfmH8Nx_Ccprhnmd1ZCdbvoulIQ2o4P_xTAGUAe6NHIb0Y8_MimfhqzkLxtrXVVyNHelXncfxClOj9Og04`,
    },
    body: JSON.stringify({ query: mutationQuery }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors ? result.errors[0].message : 'Network error');
  }

  return result.data.createUserEnrolledCourse;
} catch (error) {
  console.error('Error creating enrolled course:', error.message);
}
}


export const enrolledCoursesList = async(courseId, userEmail) => {
  const query = gql`
  query GetEnrolledCoursesList {
  userEnrolledCourses(
    where: {courseId: "`+courseId+`", userEmail: "`+userEmail+`"}
  ) {
    id
    courseId
    completedChapter {
      chapterId
    }
  }
}`

try {
  const response = await fetch(MASTER_URL, {
    method: 'POST',  // Changed to POST
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }), 
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors ? result.errors[0].message : "Network error");
  }

 // console.log("GetEnrolledCoursesList:", result)
  return result;
} catch (error) {
  console.error("Error:", error.message);
}
}

export const markChapterCompleted = async(chapterId, recordId) => {
  const query = gql`
 mutation markChapterCompleted {
  updateUserEnrolledCourse(
    data: {completedChapter: {create: {data: {chapterId: "`+chapterId+`"}}}}
    where: {id: "`+recordId+`"}
  ){
        id
        completedChapter {
          chapterId
        }
      }
  publishManyUserEnrolledCoursesConnection {
    edges {
      node {
        id
      }
    }
  }
}`

try {
  const response = await fetch(MASTER_URL, {
    method: 'POST',  // Changed to POST
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MzE2NTg2NDIsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtMzk4bnFnczAyOXowNndkZGtleXF1dW0vbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiJiYzQ1NGM2NC1mMTUyLTRmZWYtODc0Yi1jZDJlYTM4OTMzOGQiLCJqdGkiOiJjbTNpZ3VmcHUwZnEyMDdwaTI0bXkzZHBwIn0.BWhHJORsVG-VzYIC6n12-Zc1gyRVs4nyfN4ZSnqeW9nY41a5Kg25XIoX8rS2ty0xDQn9iQBIq5alaxICTPk_6RWTZJMv_GOKIc5-Ng7XvAxWJLJNwZe3OklAmAeHWUr0IJ5SmltRoA_La_FLCgo91qkTlAxECSIGlkdbvA4kbi6b9AqFt27qSvLXaVJ_80V-QRQnyQAoz4zVuSdIztjYOa6wLgg-prnxj8cF-UZxqQZpE0lyVx8lUjhmOPFaJPZwm5gcKTVQ3mjMK430Wq245kenQcZQdUzbq92fxUxPwOHlPsxZxowdfu4xOiGgDKvQRHDrNCyfQPvOMhHLFhdSrjzc8zeerG4LkoBIXK_DaF4aaySn9JqzXb0IjncBTylMfUz3wi_XrfOffy9ObuDPDqwDa-wsD_RKqgvSV6QQjqRpwKXMGKoa7_cIBaTj5QfYZ_W_nUmNg7F_DrXHrhM8KmTFqGRHDEun3Fvs7aDeGGJ8UaCkun-sWJ_wYJgpxIKx1DMwSpz07-LP1YnSlRCgzcZDe7wcSgXNd6TCAS9PuHdp6-YzJmCxFhV5pNCNIaoO2P9JYVH1yC7z-KeqNKFx9Ujz-SfmH8Nx_Ccprhnmd1ZCdbvoulIQ2o4P_xTAGUAe6NHIb0Y8_MimfhqzkLxtrXVVyNHelXncfxClOj9Og04`
    },
    body: JSON.stringify({ query }), 
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors ? result.errors[0].message : "Network error");
  }

  //console.log("markChapterCompletedList:", result)
  return result;
} catch (error) {
  console.error("Error:", error.message);
}
}

export const getAllEnrolledCourseProgress = async (userEmail) => {
  const query = gql`
query GetAllEnrolledCourseProgress {
  userEnrolledCourses(where: {userEmail: "ayantikaroy530@gmail.com"}) {
    completedChapter {
      chapterId
    }
    course {
      name
      picture {
        url
      }
       chapters {
      id
      title
      content {
        heading
        description {
          markdown
          html
        }
        output {
          markdown
          html
        }
      }
    }
      description {
        markdown
      }
      id
      courseLevel
      price
      time
    }
  }
} `

try {
const response = await fetch(MASTER_URL, {
  method: 'POST',  // Changed to POST
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query }), 
});

const result = await response.json();

if (!response.ok) {
  throw new Error(result.errors ? result.errors[0].message : "Network error");
}

console.log("GetAllEnrolledCourseProgress:", result)
return result;
} catch (error) {
console.error("Error:", error.message);
}
};