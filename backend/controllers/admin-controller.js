const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const addAdmin = 
    async function(req, res, next)
    {
        const { email, password } = req.body;
        let existingAdmin;
        try
        {
            exisitingAdmin = await Admin.findOne({ email });
        }
        catch(error)
        {
            return console.log(error);
        }

        if(existingAdmin)
        {
            return res.status(400).json(
            {
               message: "Admin already exits!" 
            });
        }

        let admin;
        const hashedpassword = bcrypt.hashSync(password);
        try
        {
            admin = new Admin(
                {
                    email,
                    password: hashedpassword
                }
            );
            admin = await admin.save();
        }
        catch(error)
        {
            return console.log(error);
        }

        if(!admin)
        {
            return res.status(400).json(
                {
                    message: "Unable to create admin"
                }
            );
        }

        return res.status(201).json(
            {
                message: "Admin created",
                admin: admin
            }
        );
    };

const adminLogin = 
    async function(req, res, next)
    {
        const { email, password } = req.body;

        if(!email && email.trim() === "" && !password && password.trim() === "") 
        {
            return res.status(400).json(
                { 
                    message: "Invalid Inputs"
                }
            );
        }

        let existingAdmin;

        try 
        {
            existingAdmin = await Admin.findOne({email});
        } 
        catch (error)
        {
            return console.log(error);
        }

        if(!existingAdmin)
        {
            return res.status(401).json(
                {
                    message: "Admin not found"
                }
            );
        }

        const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password)

        if(!isPasswordCorrect)
        {
            return res.status(400).json(
                {
                    message: "Incorrect Password"
                }
            );
        }

        const token = jwt.sign({id: existingAdmin._id}, process.env.SECRET_KEY, {expiresIn: '7d'})
        return res.status(200).json({message: "Authentication Successful", token, id:existingAdmin._id});
    };

const getAdmins = 
    async function (req,res)
    {
        let admins;

        try
        {
            admins = await Admin.find();
        }
        catch(error)
        {
            return res.send(error.message);
        }

        if(!admins)
        {
            return res.status(400).json(
                {
                    message:"cannot get admin"
                }
            );
        }

        return res.status(200).json({admins});
    };

const getAdminByID = 
    async function(req, res, next) 
    {
        const id = req.params.id;

        let admin;

        try 
        {
            admin = await Admin.findById(id).populate("addedMovies");
        } 
        catch (error) 
        {
            return console.log(error);
        }

        if (!admin) 
        {
            return console.log("Cannot find Admin");  
        }
        
        return res.status(200).json({ admin })
    };
    
module.exports = { addAdmin, adminLogin, getAdmins, getAdminByID };