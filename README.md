
原先使用印象笔记可以简单随时的看自己的代码记录 <br />
转战github 
# 分支整理
==============合并分支简述==============<br />
1、创建分支<br />
创建分支很简单：git branch <分支名><br />
2、切换分支<br />
git checkout <分支名><br />
该语句和上一个语句可以和起来用一个语句表示：git checkout -b <分支名><br />
3、分支合并<br />
比如，如果要将开发中的分支（develop），合并到稳定分支（master），<br />
首先切换的master分支：git checkout master。<br />
然后执行合并操作：git merge develop。<br />
如果有冲突，会提示你，调用git status查看冲突文件。<br />
解决冲突，然后调用git add或git rm将解决后的文件暂存。<br />
所有冲突解决后，git commit 提交更改。<br />
4、分支衍合<br />
分支衍合和分支合并的差别在于，分支衍合不会保留合并的日志，不留痕迹，而 分支合并则会保留合并的日志。<br />
要将开发中的分支（develop），衍合到稳定分支（master）。<br />
首先切换的master分支：git checkout master。<br />
然后执行衍和操作：git rebase develop。<br />
如果有冲突，会提示你，调用git status查看冲突文件。<br />
解决冲突，然后调用git add或git rm将解决后的文件暂存。<br />
所有冲突解决后，git rebase --continue 提交更改。<br />
5、删除分支<br />
执行git branch -d <分支名><br />
如果该分支没有合并到主分支会报错，可以用以下命令强制删除git branch -D <分支名><br />


