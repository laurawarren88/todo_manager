const fs = require('fs');
const TODO_FILE = 'todo_list.csv';

// Helper function to convert CSV to an array of tasks
function loadTasks() {
    try {
        const data = fs.readFileSync(TODO_FILE, 'utf-8');
        return data
            .split('\n')
            .filter(line => line.trim() !== '') // Remove empty lines
            .map(line => line.split(',')[1]);   // Extract task description
    } catch (error) {
        return [];
    }
}

// Helper function to save tasks as CSV
function saveTasks(tasks) {
    const csvContent = tasks.map((task, index) => `${index + 1},${task}`).join('\n');
    fs.writeFileSync(TODO_FILE, csvContent);
}

// Add a new task
function addTask(task) {
    const tasks = loadTasks();
    tasks.push(task);
    saveTasks(tasks);
    console.log(`Task added: ${task}`);
}

// Remove a task by its number
function removeTask(taskNumber) {
    const tasks = loadTasks();
    if (taskNumber > 0 && taskNumber <= tasks.length) {
        const removedTask = tasks.splice(taskNumber - 1, 1);
        saveTasks(tasks);
        console.log(`Task removed: ${removedTask}`);
    } else {
        console.log('Invalid task number.');
    }
}

// View all tasks
function viewTasks() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log('No tasks in your to-do list.');
    } else {
        console.log('To-do List:');
        tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task}`);
        });
    }
}

// Show help message
function showHelp() {
    console.log(`
    To-do List Manager:

    Usage:
      node todo.js add <task>         Add a task
      node todo.js remove <task_num>  Remove a task by its number
      node todo.js view               View all tasks
      node todo.js help               Show this help message
    `);
}

// Main command-line interface
const command = process.argv[2];
const args = process.argv.slice(3);

if (!command) {
    showHelp();
} else {
    switch (command.toLowerCase()) {
        case 'add':
            if (args.length === 0) {
                console.log('Error: Please specify a task to add.');
            } else {
                addTask(args.join(' '));
            }
            break;

        case 'remove':
            if (args.length === 0 || isNaN(args[0])) {
                console.log('Error: Please specify a valid task number.');
            } else {
                removeTask(Number(args[0]));
            }
            break;

        case 'view':
            viewTasks();
            break;

        case 'help':
        default:
            showHelp();
            break;
    }
}