"use strict";
// Масиви даних
const professors = [];
const classrooms = [];
const courses = [];
const schedule = [];
// Додавання професора
function addProfessor(professor) {
    professors.push(professor);
}
// Функція для перевірки на конфлікти
function validateLesson(lesson) {
    const professorConflict = schedule.find((l) => l.professorId === lesson.professorId && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek);
    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: professorConflict };
    }
    const classroomConflict = schedule.find((l) => l.classroomNumber === lesson.classroomNumber && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek);
    if (classroomConflict) {
        return { type: "ClassroomConflict", lessonDetails: classroomConflict };
    }
    return null;
}
// Додавання заняття з перевіркою конфліктів
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.log(`Конфлікт в розкладі: ${conflict.type}`);
        return false;
    }
    schedule.push(lesson);
    return true;
}
// Функція для пошуку вільних аудиторій
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const bookedClassrooms = schedule
        .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);
    return classrooms
        .filter(classroom => !bookedClassrooms.includes(classroom.number))
        .map(classroom => classroom.number);
}
// Функція для отримання розкладу професора
function getProfessorSchedule(professorId) {
    return schedule.filter(lesson => lesson.professorId === professorId);
}
// Функція для отримання завантаженості аудиторії (у відсотках)
function getClassroomUtilization(classroomNumber) {
    const totalSlots = 5 * 5; // 5 днів по 5 слотів
    const usedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (usedSlots / totalSlots) * 100;
}
// Функція для визначення найпопулярнішого типу занять
function getMostPopularCourseType() {
    const courseCount = {};
    courses.forEach(course => {
        courseCount[course.type] = (courseCount[course.type] || 0) + 1;
    });
    let mostPopular = "Lecture";
    let maxCount = 0;
    for (const type in courseCount) {
        if (courseCount[type] > maxCount) {
            maxCount = courseCount[type];
            mostPopular = type;
        }
    }
    return mostPopular;
}
// Функція для зміни аудиторії заняття
function reassignClassroom(lessonId, newClassroomNumber) {
    const lesson = schedule.find(l => l.courseId === lessonId);
    if (!lesson)
        return false;
    const classroomConflict = schedule.find((l) => l.classroomNumber === newClassroomNumber && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek);
    if (classroomConflict)
        return false;
    lesson.classroomNumber = newClassroomNumber;
    return true;
}
// Функція для скасування заняття
function cancelLesson(lessonId) {
    const lessonIndex = schedule.findIndex(l => l.courseId === lessonId);
    if (lessonIndex !== -1) {
        schedule.splice(lessonIndex, 1); // Видаляємо заняття з розкладу
    }
}
