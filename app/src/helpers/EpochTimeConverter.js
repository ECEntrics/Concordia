const epochTimeConverter = (timestamp) => {
  const timestampDate = new Date(0);
  timestampDate.setUTCSeconds(timestamp);
  return (`${timestampDate.getDate()}/${
    timestampDate.getMonth() + 1}/${
    timestampDate.getFullYear()}, ${
    timestampDate.getHours()}:${
    ("0"+timestampDate.getMinutes()).slice(-2)}:${
    timestampDate.getSeconds()}`);
};

export default epochTimeConverter;
