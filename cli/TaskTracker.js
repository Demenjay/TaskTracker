import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';


function readTasks() {
  try {
    if (!fs.existsSync('tasks.json')) {
      fs.writeFileSync('tasks.json', JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync('tasks.json'));
  } catch (err) {
    console.error('Помилка читання tasks.json.Дані будуть скинуті.')
    return [];
  }
}
function writeTasks(tasks) {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks));
}


function listTasks(tasks) {
  console.log(chalk.bold('Ваші завдання:'));
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task}`);
  });
}

async function main() {
  const tasks = readTasks();

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Що ви хочете зробити?',
        choices: ['Додати завдання', 'Видалити завдання', 'Показати всі завдання', 'Вийти'],
      },
    ]);

    switch (action) {
      case 'Додати завдання':
        const { newTask } = await inquirer.prompt([
          {
            type: 'input',
            name: 'newTask',
            message: 'Введіть нове завдання:',
          },
        ]);
        tasks.push(newTask);
        writeTasks(tasks);
        break;
      case 'Видалити завдання':
        listTasks(tasks);
        const { indexToDelete } = await inquirer.prompt([
          {
            type: 'number',
            name: 'indexToDelete',
            message: 'Введіть номер завдання для видалення:',
          },
        ]);
        tasks.splice(indexToDelete - 1, 1);
        writeTasks(tasks);
        break;
      case 'Показати всі завдання':
        listTasks(tasks);
        break;
      case 'Вийти':
        console.log(chalk.green('До побачення!'));
        return;
    }
  }
}

main();