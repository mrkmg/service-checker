// Generated by CoffeeScript 1.10.0

/*
 * service-checker : bin/generate_release
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var Exec, FS, Inquirer, Promise, bumpVersion, confirmUpdate, getBumpType, getCurrentVersion, writeNewVersionPackage, writeNewVersionToReadme;

  Inquirer = require('inquirer');

  Promise = require('bluebird');

  FS = require('fs');

  Exec = require('child_process').execSync;

  getCurrentVersion = function() {
    return require('../../package.json').version;
  };

  getBumpType = function() {
    var args;
    args = {
      type: 'list',
      name: 'release',
      message: 'Release Type?',
      "default": 'patch',
      choices: ['patch', 'minor', 'major']
    };
    return new Promise(function(resolve) {
      return Inquirer.prompt([args], function(answers) {
        return resolve(answers.release);
      });
    });
  };

  bumpVersion = function(version, bump) {
    var version_split;
    version_split = (version.split('.')).map(function(t) {
      return parseInt(t);
    });
    switch (bump) {
      case 'patch':
        version_split[2]++;
        break;
      case 'minor':
        version_split[1]++;
        version_split[2] = 0;
        break;
      case 'major':
        version_split[0]++;
        version_split[1] = 0;
        version_split[2] = 0;
        break;
      default:
        console.log('Unknown Bump Type');
        process.exit(1);
    }
    return version_split.join('.');
  };

  confirmUpdate = function(current_version, new_version) {
    var args;
    args = {
      type: 'confirm',
      name: 'confirm',
      message: "Are you sure you want to update the release from " + current_version + " to " + new_version
    };
    return new Promise(function(resolve) {
      return Inquirer.prompt(args, function(answers) {
        return resolve(answers.confirm);
      });
    });
  };

  writeNewVersionToReadme = function(current_version, new_version) {
    var file, new_file;
    file = FS.readFileSync('./README.md');
    new_file = file.toString().replace(current_version, new_version);
    return FS.writeFileSync('./README.md', new_file, 'utf8');
  };

  writeNewVersionPackage = function(current_version, new_version) {
    var pack;
    pack = require('../../package.json');
    pack.version = new_version;
    return FS.writeFileSync('./package.json', JSON.stringify(pack, null, 2), 'utf8');
  };

  module.exports = function(args) {
    var bump_type, current_version, new_version;
    current_version = '0.0.0';
    new_version = '9.9.9';
    bump_type = 'patch';
    return Promise["try"](getCurrentVersion).then(function(version) {
      return current_version = version;
    }).then(getBumpType).then(function(type) {
      return bump_type = type;
    }).then(function() {
      return bumpVersion(current_version, bump_type);
    }).then(function(version) {
      return new_version = version;
    }).then(function() {
      return confirmUpdate(current_version, new_version);
    }).then(function(do_update) {
      if (!do_update) {
        return process.exit(1);
      }
    }).then(function() {
      var opts;
      opts = {
        env: {
          HOME: process.env.HOME
        }
      };
      Exec('git fetch', opts);
      Exec('git checkout develop', opts);
      Exec('git pull origin develop --rebase', opts);
      Exec('git checkout master', opts);
      Exec('git reset --hard origin/master', opts);
      Exec('git checkout develop', opts);
      return Exec("git flow release start " + new_version, opts);
    }).then(function() {
      return writeNewVersionToReadme(current_version, new_version);
    }).then(function() {
      return writeNewVersionPackage(current_version, new_version);
    }).then(function() {
      var opts;
      opts = {
        env: {
          HOME: process.env.HOME,
          GIT_MERGE_AUTOEDIT: 'no'
        }
      };
      Exec('git add -A', opts);
      Exec('git commit -am "Release ' + new_version + '"', opts);
      Exec('git flow release finish -m "' + new_version + '" ' + new_version, opts);
      Exec('git push origin develop', opts);
      Exec('git push origin master', opts);
      return Exec('git pish origin --tags', opts);
    });
  };

}).call(this);
