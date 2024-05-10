#! /usr/bin/env node

// Student Management System
// This project is a simple console based Student Management System. In this project you will be learning how to add new students, how to generate a 5 digit unique studentID for each student, how to enroll students in the given courses. Also, you will be implementing the following operations enroll, view balance, pay tuition fees, show status, etc. The status will show all the details of the student including name, id, courses enrolled and balance.This is one of the best projects to implement the Object Oriented Programming concepts.


import inquirer, { Answers } from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";

// Define types for student and courses 

type student = {
  id : string;
  name : string;
  courses : string[];
  dueCharges : number;
};

type course = {
  name : string;
  fee : number;
};

// Initialize student database 
let students : student[] = [];

// Initialize course database 
let availableCourses : course[] = [
  { name : "Machine Learning", fee : 2000},
  { name : "Web Development 3.0", fee : 3000},
  { name : "Cloud Computing", fee : 2200},
  { name : "Data Science", fee : 2500},
  { name : "Cybersecurity", fee : 2300},
];

// Function to generate unique student id 
function generateStudentID(): string {
  return Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Function to calculate and display due charges of a student 
function viewDueCharges(student : student): void {
      console.log(chalk.yellow.bold(`Due charges of ${student.name}: Rs/-${student.dueCharges}`));
  }

// Function to enroll a student 
async function enrollStudent(): Promise<void> {
  console.log(chalk.bgBlue.bold("Enroll Student"));

  // Ask for student details 
  const studentDetails = await inquirer.prompt([
      {
          type : "input",
          name : "studentName",
          message : "Please enter student name:"
      },



  ]);
  // Generate student id and store it in a variable 
  const studentId = generateStudentID();

  console.log(chalk.yellow.bold("Available Courses:"));

  // Ask user to choose a course 

  const {chosenCourse}: Answers = await inquirer.prompt([
      {
          type : "list",
          name : "chosenCourse",
          message : "Choose a course:",
          choices : availableCourses.map( course => ({name : `• ${course.name} - (Rs/-${course.fee})`,
          value : course.name })),
      },
  ]);

  // Find the choosen course
  const chosenCourseDetails: course | undefined = availableCourses.find(course => course.name === chosenCourse);
  
  if (chosenCourseDetails) {
      // Update student"s course list 
      const student : student = {
          id : studentId,
          name : studentDetails.studentName,
          courses : [chosenCourse],
          dueCharges : chosenCourseDetails.fee,
      };

      // Add student to student database 
      students.push(student);

      // Show enrollment success message with student ID
      console.log(chalk.green.bold("Student enrollled successfully!"));
      console.log(chalk.green.bold(`Student ID: ${studentId}`));
      console.log(chalk.green.bold(`Enrolled Course: • ${chosenCourse}`));
      console.log(chalk.green.bold(`Course Fee: ${chosenCourseDetails.fee}`));
    } else {
      console.log(chalk.red.bold("Invalid course selection!"));
    }
}

// Function to remove a student 

async function removeStudent(): Promise<void> {
  console.log(chalk.blue.bold("Remove Student"));

  // Ask for student ID
  const {id}: Answers = await inquirer.prompt([
      {
          type : "input",
          name : "id",
          message : "Enter student ID to remove student:",
      },
  ]);

  // Find student by ID 
  const index: number = students.findIndex(student => student.id === id);
  if (index !== -1) {
      // Remove student
      students.splice(index , 1);

      console.log(chalk.green.bold("Student removed successfully!"));
  } else {
      console.log(chalk.red.bold("Student not found!"));
  }
}

// Function to pay course fees
async function payFees(): Promise<void> {
  console.log(chalk.blue.bold("Pay Fees"));

  // Ask for student ID
  const { id }: Answers = await inquirer.prompt([
      {
          type: "input",
          name: "id",
          message: "Enter student ID to pay fees:",
      },
  ]);

  // Find student by ID
  const student: student | undefined = students.find(student => student.id === id);

  if (student) {
      console.log(chalk.yellow.bold(`Student Name: ${student.name}`));
      console.log(chalk.yellow.bold("Available Courses:"));
      student.courses.forEach(course => {
          const courseDetails = availableCourses.find(c => c.name === course);
          if (courseDetails) {
              console.log(chalk.yellow(`• ${course} - Rs/-${courseDetails.fee}`));
          }

      viewDueCharges(student); // View due charges before paying 

      });

      // Ask for the amount to pay
      const { amount }: Answers = await inquirer.prompt([
          {
              type: "number",
              name: "amount",
              message: "Enter the amount to pay:",
              validate: (value: any) => {
                  if (isNaN(value) || value <= 0) {
                      return "Please enter a valid amount.";
                  }
                  return true;
              },
          },
      ]);

      // Deduct the paid amount from due charges 
      if (amount <= student.dueCharges) {
          student.dueCharges -= amount;
          console.log(chalk.green.bold(`Paid Rs/-${amount} successfully!`));

          viewDueCharges(student); // View updated due charges after paying 
      } else {
          console.log(chalk.red.bold("Amount exceeds due charges!"));
      }
  } else {
      console.log(chalk.red.bold("Student not found!"));
  }
}

// Fucntion to add a course to a student 
async function addCourse(): Promise<void> {
  console.log(chalk.blue.bold("Add Course"));

  // Ask for student ID 
  const { id }: Answers = await inquirer.prompt([
      {
          type : "input",
          name : "id",
          message : "Enter student ID to add a course:",
      },
  ]);

  // Find student by ID
  const student: student | undefined = students.find(student => student.id === id);
  if (student) {
      console.log(chalk.yellow.bold("Available Courses:"));
      availableCourses.forEach(course => {
          console.log(chalk.yellow(`• ${course.name} - Rs/-${course.fee}`));
      });

      // Ask user to choose a course 
      const {chosenCourse}: Answers = await inquirer.prompt([
          {
              type : "list",
              name : "chosenCourse",
              message : "Choose a course to add:",
              choices : availableCourses.map( course => ({name : `• ${course.name} - (Rs/-${course.fee})`,
               value : course.name})),
          },
      ]);

      // Find the choosen course
      const chosenCourseDetails: course | undefined = availableCourses.find(course => course.name === chosenCourse);
      if (chosenCourseDetails) { // Add course to student's courses
          student.courses.push(chosenCourse);

          updateDueCharges(student, chosenCourseDetails.fee);

          console.log(chalk.green.bold(`${chosenCourse} added successfully!`));
      } else {
          console.log(chalk.red.bold("Invalid course selection!"));
      } 
      } else {
          console.log(chalk.red.bold("Student not found!"));

      }
  }


// Function to update due charges when a course is added 
function updateDueCharges(student : student, courseFee : number): void {
  student.dueCharges += courseFee;
}

// Function to calculate total due charges for a student
function calculateTotalDueCharges(student: student): number {
  let totalDueCharges: number = 0;
  student.courses.forEach( course => {
      const courseDetails: course | undefined = availableCourses.find(c => c.name === course);
      if (courseDetails) {
          totalDueCharges += courseDetails.fee;
      }
  });
  return totalDueCharges;
}

// Function to remove a course from a student 
async function removeCourse(): Promise<void> {
  console.log(chalk.blue.bold("Remove Course"));

  // Ask a student ID
  const { id }: Answers = await inquirer.prompt([
      {
          type : "input",
          name : "id",
          message : "Enter student ID to remove a course:",
      },
  ]);

  // Find student by ID
  const student: student | undefined = students.find(student => student.id === id);
  if (student) {
      console.log(chalk.yellow.bold("Student's Enrolled Courses:"));
      student.courses.forEach(course => {
          console.log(chalk.yellow(`• ${course}`));
      });

      // Ask student to choose a course to remove 
      const { removeCourse }: Answers = await inquirer.prompt([
          {
              type : "list",
              name : "removeCourse",
              message : "Choose a course to remove:",
              choices : student.courses.map(course => ({name : `• ${course}`, value : course })),
          },
      ]);

      // Find the index of the course to be removed 
      const index: number= student.courses.findIndex(course => course === removeCourse);
      if (index !== -1) {
          // Find the course details 
          const removedCourseDetails: course | undefined = availableCourses.find(course => course.name === removeCourse);
          if (removedCourseDetails) {
              // Remove course from student's courses 
              student.courses.splice(index, 1);

              // Subtract course fee from due charges 
              student.dueCharges -= removedCourseDetails.fee;

              console.log(chalk.green.bold(`${removeCourse} removed successfully!`));
          } else {
              console.log(chalk.red.bold("Course detials not found!"));
          }
      } else {
          console.log(chalk.red.bold("Selected course not found in student's enrolled courses!"));
      }
} else {
  console.log(chalk.red.bold("Student not found!"));
}

}

// Function to view all students 
function viewAllStudents(): void {
  console.log(chalk.blue.bold("List of all students\n"));

  students.forEach(student => {
      console.log(chalk.yellow.bold(`Student ID: ${student.id}`));
      console.log(chalk.yellow.bold(`Student Name: ${student.name}`));
      console.log(chalk.yellow.bold("Courses Enrolled:"));

      student.courses.forEach(course => {
          console.log(chalk.yellow(`• ${course}`));
      });
      console.log(chalk.yellow.bold(`Due Charges: Rs/-${student.dueCharges}`));

      console.log(chalk.cyan("--------------------------------"));
  });
}

// Function to show status of a student 
async function showStudentStatus(): Promise<void> {
  console.log(chalk.blue.bold("Student Status"));

  // Ask for student ID 
  const { id }: Answers = await inquirer.prompt([
      {
          type : "input",
          name : "id",
          message : "Enter student ID to view status:",
      },
  ]);

  // Find student by ID 
  const student: student | undefined = students.find(student => student.id === id);
  if (student) {
      console.log(chalk.yellow.bold(`Student ID: ${student.id}`));
      console.log(chalk.yellow.bold(`Student Name: ${student.name}`));
      console.log(chalk.yellow.bold("Courses Enrolled:"));

      student.courses.forEach(course => {
          console.log(chalk.yellow(`• ${course}`));
      });
      console.log(chalk.yellow.bold(`Due Charges: Rs/-${student.dueCharges}`));
  } else {
      console.log(chalk.red.bold("Student not found!"));
  }
}

// Main function to run the program 

async function main(): Promise<void> {
  // Start animation
  const animation: chalkAnimation.Animation = chalkAnimation.rainbow("Student Management System");

  // Wait for 3 seconds 
  await new Promise((resolve) => setTimeout( resolve, 3000));

  // Stop animation 
  animation.stop();

  // Start animation for loading message 
  const loadingAnimation: chalkAnimation.Animation = chalkAnimation.rainbow("Loading...");

  // Wait for 3 seconds 
  await new Promise((resolve) => setTimeout( resolve, 3000));

  // Stop animation 
  loadingAnimation.stop();

  // Ask user for action 
  while (true) {
      const { action }: Answers = await inquirer.prompt([
          {
              type : "list",
              name : "action",
              message : "Choose an action:",
              choices : ["Enroll Student", "Remove Student", "Pay Fees", "Add Course", 
              "Remove Course", "View All Students", "View Due Charges", "Show Student Status", "Exit"],
          },
      ]);

      switch (action) {
          case "Enroll Student":
              await enrollStudent();
              break;

          case "Remove Student":
              await removeStudent();
              break;

          case "Pay Fees":
              await payFees();
              break;
              
          case "Add Course":
              await addCourse();
              break;
              
          case "Remove Course":
              await removeCourse();
              break;
              
          case "View All Students":
              viewAllStudents();
              break;

          case "View Due Charges":
              const {id}: Answers = await inquirer.prompt([
                  {
                      type : "input",
                      name : "id",
                      message : "Enter student ID to view due charges:",
                  },
                  ]);
          
                  // Find student by ID
                  const student: student | undefined = students.find(student => student.id === id);
                  if (student) {
                      viewDueCharges(student);
                  } else {
                      console.log(chalk.red.bold("Student not found!"));
                  }
              break;

          case "Show Student Status":
              await showStudentStatus();
              break;    
              
          case "Exit":
              console.log(chalk.magenta("Exiting program..."));
              return;    
      }
  }
}

// Run main function 
main();