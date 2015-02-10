import {spawn} from 'child_process';

export default class Runner {
  constructor(path) {
    this.path = path;
    this.image = null;
  }

  build() {
    return new Promise((resolve, reject) => {
      let buildProc = spawn('docker', ['build', this.path]);
      var stdout = '';
      var stderr = '';

      buildProc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      buildProc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      buildProc.on('close', (code) => {
        if (code === 0) {
          let match = stdout.match(/Successfully built ([0-9a-f]+)/);
          if (match) {
            this.image = match[1];
            resolve(this.image);
          } else {
            reject({'message': 'Could not parse build output', stdout, stderr});
          }
        } else {
          reject({code, stdout, stderr});
        }
      });
    });
  }

  run() {
    if (this.image === null) {
      return Promise.reject('Run build first.');
    }
    return new Promise((resolve, reject) => {
      let runProc = spawn('docker', ['run', this.image]);

      var stdout = '';
      var stderr = '';

      runProc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      runProc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      runProc.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject({code, stdout, stderr});
        }
      });
    });
  }
}
