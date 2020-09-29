module.exports = {
  apps: [
    {
      name: 'ng-test-backend',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm run start',
      // args: 'start'
    }
  ]
}
