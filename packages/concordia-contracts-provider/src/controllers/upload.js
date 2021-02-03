import upload from '../middleware/upload';

const uploadContracts = async (req, res) => {
  try {
    await upload(req, res);

    if (req.files.length <= 0) {
      return res.send('You must select at least 1 file.');
    }

    return res.send('Files have been uploaded.');
  } catch (error) {
    console.log(error);

    return res.send(`Error when trying upload many files: ${error}`);
  }
};

export default uploadContracts;
