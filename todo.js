// Enables use of files 
import fs from 'fs';
// Enables the use of ascii 
import figlet from 'figlet';
// Enables the use of colour in the terminal
import {Chalk} from 'chalk';
// Allows more variety of colour with customisation
const customChalk = new Chalk({level: 2});

// Saves/updates to-do list in to a csv file
const TODO_FILE = 'todo_list.csv';

// Load tasks from CSV
function loadTasks() {
    try {
        const data = fs.readFileSync(TODO_FILE, 'utf-8');
        return data
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                const [id, description, date, type] = line.split(',');
                return { id: Number(id), description, date, type };
            });
    } catch (error) {
        return [];
    }
}

// Save tasks to CSV 
function saveTasks(tasks) {
    const csvContent = tasks
        .map((task, index) => `${index + 1}:,${task.description},${task.date},${task.type}`)
        .join('\n');
    fs.writeFileSync(TODO_FILE, csvContent);
}

// Add a new task
function addTask(description, type) {
    const tasks = loadTasks();
    const date = new Date().toDateString(); // .split('T')[0]
    const task = { description, date, type };
    tasks.push(task);
    saveTasks(tasks);
    console.log(`Task added: ${description} (${type}) on ${date}`);
}

// Remove a task by its number
function removeTask(taskNumber) {
    const tasks = loadTasks();
    if (taskNumber > 0 && taskNumber <= tasks.length) {
        const removedTask = tasks.splice(taskNumber - 1, 1);
        saveTasks(tasks);
        console.log(`Task removed: ${removedTask[0].description}`);
    } else {
        console.log('Invalid task number.');
    }
}

// Colour based on task type
function getColourForType(type) {
    switch (type.toLowerCase()) {
        case 'personal':
            return customChalk.magentaBright;
        case 'work':
            return customChalk.cyanBright;
        case 'urgent':
            return customChalk.redBright.bold;
        case 'health':
            return customChalk.greenBright;
        default:
            return customChalk.whiteBright;
    }
}

// Display the key for colour coding
function displayKey() {
    console.log("\nColour Key for task type:");
    console.log(customChalk.magentaBright("Personal") + (", ") + customChalk.cyanBright("Work") + (", ") + customChalk.redBright.bold("Urgent") + (", ") + customChalk.greenBright("Health"));
}

// Random chalk colour
function getRandomColour() {
    const colours = [
        customChalk.hex('#fbc021'),
        customChalk.hex('#38b621'),
        customChalk.hex('#c72ae3'),
        customChalk.hex('#4a4ff2'),
    ];
    return colours[Math.floor(Math.random() * colours.length)];
}

// Randomly colour each letter of ASCII text
function colourisedAsciiArt(asciiArt) {
    let colourAsciiArt = '';
    for (let char of asciiArt) {
        if (char !== ' ') { 
            const randomColour = getRandomColour();
            colourAsciiArt += randomColour(char);
        } else {
            colourAsciiArt += char; 
        }
    }
    return colourAsciiArt;
}

// View all tasks with ASCII art header
function viewTasks() {
    // const randomColour = getRandomColour();
    figlet.text('TO DO LIST', {
        font: 'alphabet',
        // font: 'barbwire',
        // font: 'standard'
    }, function(err, data) {
        if (err) {
            console.log('Something went wrong with figlet...');
            console.dir(err);
            return;
        }
        
        // Print ASCII art title
        console.log(colourisedAsciiArt(data)); 

        // Load and display tasks
        const tasks = loadTasks();
        if (tasks.length === 0) {
            console.log('No tasks in your to-do list.');
        } else {
            tasks.forEach((task, index) => {
                const colourFn = getColourForType(task.type); 
                console.log(`${index + 1}: ${colourFn(task.description)}`);
            });
            displayKey();
        }
    });
}

// Sort tasks by date
function sortTasks() {
    const tasks = loadTasks();
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log('List of tasks in date order:');
    tasks.forEach((task) => {
        const colourFn = getColourForType(task.type); 
        console.log(`${colourFn(task.description)} - ${task.date}`);
    });
}

// Filter tasks by type
function filterTasks(type) {
    const tasks = loadTasks();
    const filteredTasks = tasks.filter(task => task.type === type);
    if (filteredTasks.length === 0) {
        console.log(`No tasks found for: ${type}`);
    } else {
        console.log(`These are all your "${type}" tasks:`);
        filteredTasks.forEach((task) => {
            const colourFn = getColourForType(task.type); 
            console.log(`${colourFn(task.description)}`);
        });
    }
}

function showHelp() {
    console.log(`
node todo.js add <task> <type>    Add a task with a type
node todo.js remove <task_num>    Remove a task by its number
node todo.js view                 View all tasks
node todo.js sort                 Sort tasks by date
node todo.js filter <type>        Filter tasks by type
node todo.js help                 Show this help message`
    );
    displayKey();
}

const command = process.argv[2];
const args = process.argv.slice(3);

if (!command) {
    showHelp();
} else {
    switch (command.toLowerCase()) {
        case 'add':
            if (args.length < 2) {
                console.log('Error: Please specify a task description and a type.');
            } else {
                const taskDescription = args[0];
                const taskType = args[1];
                addTask(taskDescription, taskType);
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

        case 'sort':
            sortTasks();
            break;

        case 'filter':
            if (args.length === 0) {
                console.log('Error: Please specify a task type to filter by.');
            } else {
                filterTasks(args[0]);
            }
            break;

        case 'help':
        default:
            showHelp();
            break;
    }
}