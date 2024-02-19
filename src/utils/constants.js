let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-wed-server.onrender.com'
}
export const APT_ROOT = apiRoot


// import.meta.env học thêm cái này
