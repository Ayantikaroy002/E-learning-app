import { gql, request } from 'graphql-request'
import { API_TOKEN } from '@env';

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
      'Authorization': `Bearer ${API_TOKEN}`,
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
      'Authorization': `Bearer Bearer ${API_TOKEN}`
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