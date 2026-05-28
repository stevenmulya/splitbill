async function run() {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDHz6KFZQ5s03uKz3Vx5yggov7Wmrn8aRY');
    const data = await response.json();
    console.log(data.models?.map(m => m.name));
  } catch (e) {
    console.error(e);
  }
}
run();
