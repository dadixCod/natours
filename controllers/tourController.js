const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    //1-A)Filtering
    const queryObj = { ...req.query }; //Distructure and create a copy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //Build query because it won't be possible to chain all methods and await them in the same time

    //1-B) Advance filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let query = Tour.find(JSON.parse(queryString));

    //2) SORTING

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    // 3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    //Execute query

    const tours = await query;
    //{difficulty : 'easy',duration:{$gte:5}}

    //Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
    // const query =  Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error.message,
    });
  }
};
exports.getOneTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id:req.params.id}) same as above
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        updated: updatedTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error.message,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Deleted Successfully',
    });
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error.message,
    });
  }
};
