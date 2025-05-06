import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';

const FILE_PATH = './data.json';
const git = simpleGit();

const makeCommits = async (n) => {
  if (n === 0) {
    try {
      await git.push();
      console.log('Pushed to remote repository');
      return;
    } catch (error) {
      console.error('Error pushing to remote:', error);
      return;
    }
  }

  const x = random.int(0, 54); // weeks
  const y = random.int(0, 6);  // days
  const date = moment()
    .subtract(1, 'y')
    .add(1, 'd')
    .add(x, 'w')
    .add(y, 'd')
    .format();

  const data = {
    date: date
  };

  try {
    await jsonfile.writeFile(FILE_PATH, data);
    await git.add(FILE_PATH);
    await git.commit(date, FILE_PATH, { '--date': date });
    console.log(`Commit ${n} created for ${date}`);
    
    // Recursively make next commit
    await makeCommits(--n);
  } catch (error) {
    console.error('Error creating commit:', error);
  }
};

// Start making commits
makeCommits(150).then(() => {
  console.log('All commits created!');
});