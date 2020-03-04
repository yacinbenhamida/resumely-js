import mongoose from 'mongoose'; 
import User from '../models/user.model';

exports.getUser = (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err) {
            res.send(err);
        }

        res.json(user);
    });
};

exports.getAllUsers = (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.send(err);
        }

        res.json(users);
    });
};

exports.createUser = (req, res) => {
    const newUser = new User(req.body);

    newUser.save((err, user) => {
        if (err) {
            res.send(err);
        }

        res.json(user);
    });
};

exports.updateUser = (req, res) => {
    User.findOneAndUpdate({
        _id: req.params.userId
    }, req.body,
        (err, user) => {
            if (err) {
                res.send(err);
            }

            res.json(note);
        });
};

exports.deleteUser = (req, res) => {
    User.remove({
        _id: req.params.userId
    }, (err) => {
        if (err) {
            res.send(err);
        }

        res.json({
            message: `User ${req.params.userId} successfully deleted`
        });
    });
};