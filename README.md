GETTING STARTED

1.) Set up a Github account.

2.) Install git on your computer.

3.) Run the following:
$ git clone git@github.com:vllry/seng299.git
This will download the current project files and git metadata.



USING GIT

To make sure you have the latest version of the project, run
$ git pull
This will download and merge any updates into what you have on your computer.

Make the edits you want to. Try to stick to specific goals, to make any rollbacks easier and commit messages more accurate.

When you want to submit your changes/additions, run

$git add *
$git commit

You will be prompted to write a commit message. PLEASE USE THIS TO SUMARIZE WHAT YOU HAVE DONE! It is EXTREMELY helpful in keeping track of progress and locating when a bug was introduced.

Finally, run
$git push

Git is very good at merging people's edits. For example, if one person edits one function and another person edits a different function in the same file, those changes can be consolidated automatically. However, sometimes conflicts happen that need human intervention to be resolved. That is a little too complicated to cover in this readme. Google what to do and/or ask Vallery when it happens.
