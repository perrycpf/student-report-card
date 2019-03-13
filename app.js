const fs = require('fs');
const csvjson = require('csvjson');
const path = require('path');
const options = {
    delimiter : ','
  };
const file1 = fs.readFileSync(path.join(__dirname, '/input-data/students.csv'), { encoding : 'utf8'});
const file2 = fs.readFileSync(path.join(__dirname, '/input-data/marks.csv'), { encoding : 'utf8'});
const file3 = fs.readFileSync(path.join(__dirname, '/input-data/courses.csv'), { encoding : 'utf8'});
const file4 = fs.readFileSync(path.join(__dirname, '/input-data/tests.csv'), { encoding : 'utf8'});

const students = csvjson.toObject(file1, options);
const marks = csvjson.toObject(file2, options);
const courses = csvjson.toObject(file3, options);
const tests = csvjson.toObject(file4, options);

const courseData = course_id => courses.find(course => Number(course.id === course_id));
const testData = test_id => tests.find(test => test.id === test_id);

const studentMarks = id => {
    let classMarks = {};
    let scores = marks.filter(test => test.student_id === id);
  
    for (let { test_id, mark } of scores) {
      let { course_id, weight } = testData(test_id);
      if (!classMarks[course_id]) classMarks[course_id] = 0;
      classMarks[course_id] += (mark * weight) / 100;
    }
    return Object.entries(classMarks);
  };

  const generateReportCard = students.map(student => {
      const marks = studentMarks(student.id);
      const average = marks.map(mark => mark[1]).reduce((sum, score) => sum + score) / marks.length;

      const finalGrades = marks.map(([course_id, score]) => {
        let {name: subject, teacher} = courseData(course_id);  
        return `    Course: ${subject}, Teacher: ${teacher}\n` +
               `    Final Grade: ${score.toFixed(2)}%\n`;
      }).join('\n');
      return `Student Id: ${student.id}, name: ${student.name}\n` +
      `Total Average: ${average.toFixed(2)}%\n\n${finalGrades}`;
  }).join('\n\n');

fs.writeFileSync('report_cards.txt',generateReportCard);

