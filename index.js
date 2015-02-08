var http = require('http');
var path = require('path');
var fs = require('fs');

var pushover = require('pushover');
var _gitEmit = require('git-emit');
var PromiseProxy = require('proxied-promise-object');
var Git = require('git-wrapper');
var temp = PromiseProxy(Promise, require('temp'));

var gitEmit = function(path) {
  return new Promise((resolve, reject) => {
    _gitEmit(path, (err, emitter) => {
      if (err) {
        reject(err);
      } else {
        resolve(emitter);
      }
    });
  });
}

var REPOS_DIR = 'repos';

var repos = pushover(REPOS_DIR);
var repoHooks = {};
var repoGits = {};

function setupHooks(repoName, repoPath) {
  if (!(repoName in repoHooks)) {
    return gitEmit(repoPath)
    .then((emitter) => {
      repoHooks[repoName] = emitter;
      emitter.on('update', (update) => onUpdate(repoPath, update));
      return emitter;
    });
  } else {
    return Promise.resolve(repoHooks[repoName]);
  }
}

repos.on('push', function (push) {
  var repoPath = path.join(REPOS_DIR, push.repo + '.git');
  setupHooks(push.repo, repoPath)
  .then(() => {
    push.accept();
  })
  .catch((err) => {
    console.log('err', err);
    push.reject();
  });
});

function onUpdate(repoPath, update) {
  var git;
  var commit = update.arguments[2];
  var repoName = path.basename(repoPath);
  var checkoutPath;

  temp.mkdir('riddler')
  .then((tmpDir) => {
    checkoutPath = tmpDir;
    git = new PromiseProxy(Promise, new Git({'git-dir': repoPath, 'work-tree': checkoutPath}));
    return git.exec('checkout', [commit]);
  })
  .then(() => update.accept())
  .catch((err) => {
    update.output('Internal error!');
    console.error(err.stack || err.trace || err);
    update.reject();
  });
}


var server = http.createServer(repos.handle.bind(repos));
server.listen(7000);
