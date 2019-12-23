
# MMM-Facial-Recognition-OCV3
This module is a facial recognition module (detection + recognition) for [MagicMirror²](https://magicmirror.builders/).
This module is mainly inspired by the one developped by [paviro](https://github.com/paviro) : [MMM-Facial-Recognition](https:https://github.com/paviro/MMM-Facial-Recognition). 
[TOC]
# Introduction
This module uses the [OpenCV](https://opencv.org/) library and is only compatible with the v3 (only tested with the version 3.3 and the rest of the description is based on this version. Some adaptions will probably be needed to support other version).
It has been adapted to :
* Be able to support the v3.3.0 OpenCV version (the paviro one did not)
* Merge the 2 projects [MMM-Facial-Recognition](https://github.com/paviro/MMM-Facial-Recognition) (MagicMirror module) and [MMM-Facial-Recognition-Tools](https://github.com/paviro/MMM-Facial-Recognition-Tools) (tools to capture and train the model) into one project
* Mutualize some code and move some of into Classes
* Explain the way to build and install OpenCV 3.3.0 (required, the version is not available into a repository)
* Remove the Fisher and Eigen Algorithm that did not work well for Raspberry. Only LBPH Algorithm is usable.


### Capturing training images
1. Run `python tools.capture.py`.
1. Decide whether you want to capture images from your picam or convert existing .jpg images.
1. Enter the name of the person you are about to capture. Images will be stored in a folder named after the captured person in `training_data/`.
1. Follow screen instructions.
### Training model
1. Make sure you have captured all your images.
1. Run `python tools.train.py`. The script will automatically scan the directory `training_data/` for your images.
1. Wait. You will end up with a training.xml file in the current directory.
1. Copy down the `['name1', 'name2','name3']` part because you will later need it for setting up your mirror's face recognition and to test your face recognition model.
### Test your trained model
1. Make sure your training.xml from running train.py is in this directory
1. Specify your user labels in the environment with
```shell=
export FACE_USERS=name1,name2,name3
```
3. Run `python tools.facerecognition.py` to test your trained model.

# Setup the module
To setup the module in MagicMirror², add the following script int the `config.js` file in the `config/` MagicMirror² directory (Modify the script regarding the Algorithm, file location, ...).
```javascript
{
    module: 'MMM-Facial-Recognition-OCV3',
    config: {
        // Threshold for the confidence of a recognized face before it's considered a
        // positive match.  Confidence values below this threshold will be considered
        // a positive match because the lower the confidence value, or distance, the
        // more confident the algorithm is that the face was correctly detected.
        threshold: 80,
        // force the use of a usb webcam on raspberry pi (on other platforms this is always true automatically)
        useUSBCam: true,
        // Path to your training xml
        trainingFile: '/home/pi/MagicMirror/modules/MMM-Facial-Recognition-OCV3/training.xml',
        // recognition intervall in seconds (smaller number = faster but CPU intens!)
        interval: 2,
        // Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
        logoutDelay: 15,
        // Array with usernames (copy and paste from training script)
        users: [],
        //Module set used for strangers and if no user is detected
        defaultClass: "default",
        //Set of modules which should be shown for every user
        everyoneClass: "everyone",
        // Boolean to toggle welcomeMessage
        welcomeMessage: true
    }
}
```
In order for this module to do anything useful you have to assign custom classes to your modules. The class default (if you don't change it) is shown if no user is detected or a stranger. The class everyone (if you don't change it) is shown for all users. To specify modules for a certain user, use their name as classname.
```shell
{
    module: 'example_module',
    position: 'top_left',
    //Set your classes here seperated by a space.
    //Shown for all users
    classes: 'default everyone'
},
{
    module: 'example_module2',
    position: 'top_left',
    //Only shown for name1
    classes: 'name1'
}
```
# TODO
* Test with WebCam
[^first]: [Raspbian Stretch: Install OpenCV 3 + Python on your Raspberry Pi](https://www.pyimagesearch.com/2017/09/04/raspbian-stretch-install-opencv-3-python-on-your-raspberry-pi/) give a complete and very detailed explaination to build OpenCV 3, but based on python work environment. The choice here is to build and install the library deeply in the raspberry system.
[^second]: [How to easily install OpenCV 3+ on Raspberry Pi 2/3 in Raspbian ? (without using virtual environments)](http://pythonopencv.com/how-to-easily-install-opencv-3-on-raspberry-pi-23-in-raspbian-without-using-virtual-environments/) More synthetic but is adapted to be able to manage memory issues during compilation.
