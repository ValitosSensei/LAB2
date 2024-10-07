// Визначення базових типів
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Визначення основних структур
type Professor = {
    id: number;
    name: string;
    department: string;
};

type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

type Course = {
    id: number;
    name: string;
    type: CourseType;
};

type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// Масиви даних
const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];

// Додавання професора
function addProfessor(professor: Professor): void {
    professors.push(professor);
}

// Перевірка конфліктів розкладу
type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// Функція для перевірки на конфлікти
function validateLesson(lesson: Lesson): ScheduleConflict | null {
    const professorConflict = schedule.find(
        (l) => l.professorId === lesson.professorId && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek
    );
    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: professorConflict };
    }

    const classroomConflict = schedule.find(
        (l) => l.classroomNumber === lesson.classroomNumber && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek
    );
    if (classroomConflict) {
        return { type: "ClassroomConflict", lessonDetails: classroomConflict };
    }

    return null;
}

// Додавання заняття з перевіркою конфліктів
function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.log(`Конфлікт в розкладі: ${conflict.type}`);
        return false;
    }
    schedule.push(lesson);
    return true;
}

// Функція для пошуку вільних аудиторій
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const bookedClassrooms = schedule
        .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);
    return classrooms
        .filter(classroom => !bookedClassrooms.includes(classroom.number))
        .map(classroom => classroom.number);
}

// Функція для отримання розкладу професора
function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(lesson => lesson.professorId === professorId);
}

// Функція для отримання завантаженості аудиторії (у відсотках)
function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 5 * 5; // 5 днів по 5 слотів
    const usedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (usedSlots / totalSlots) * 100;
}

// Функція для визначення найпопулярнішого типу занять
function getMostPopularCourseType(): CourseType {
    const courseCount: { [key in CourseType]?: number } = {};

    courses.forEach(course => {
        courseCount[course.type] = (courseCount[course.type] || 0) + 1;
    });

    let mostPopular: CourseType = "Lecture";
    let maxCount = 0;

    for (const type in courseCount) {
        if (courseCount[type as CourseType]! > maxCount) {
            maxCount = courseCount[type as CourseType]!;
            mostPopular = type as CourseType;
        }
    }
    return mostPopular;
}

// Функція для зміни аудиторії заняття
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule.find(l => l.courseId === lessonId);

    if (!lesson) return false;

    const classroomConflict = schedule.find(
        (l) => l.classroomNumber === newClassroomNumber && l.timeSlot === lesson.timeSlot && l.dayOfWeek === lesson.dayOfWeek
    );

    if (classroomConflict) return false;

    lesson.classroomNumber = newClassroomNumber;
    return true;
}

// Функція для скасування заняття
function cancelLesson(lessonId: number): void {
    const lessonIndex = schedule.findIndex(l => l.courseId === lessonId);
    if (lessonIndex !== -1) {
        schedule.splice(lessonIndex, 1); // Видаляємо заняття з розкладу
    }
}// Додаємо професора
addProfessor({ id: 1, name: "Dr. Smith", department: "Computer Science" });

// Додаємо аудиторію
classrooms.push({ number: "101", capacity: 30, hasProjector: true });

// Додаємо курс
courses.push({ id: 1, name: "Programming 101", type: "Lecture" });

// Додаємо заняття
addLesson({ courseId: 1, professorId: 1, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });

// Виводимо розклад професора
console.log(getProfessorSchedule(1));

// Перевіряємо вільні аудиторії
console.log(findAvailableClassrooms("8:30-10:00", "Monday"));

