const epochTimeConverter = (timestamp) => {
  const timestampDate = new Date(0);
  timestampDate.setUTCSeconds(timestamp);
  return (`${timestampDate.getDate()}/${
    timestampDate.getMonth() + 1}/${
    timestampDate.getFullYear()}, ${
    timestampDate.getHours()}:${
    ("0"+timestampDate.getMinutes()).slice(-2)}:${
    ("0"+timestampDate.getSeconds()).slice(-2)}`);
};

export default epochTimeConverter;
