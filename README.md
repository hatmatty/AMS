# AET
> *Ancient Era Tech*

## Purpose

For far too long the ancient genre has not been able to come to widespread adoption of a new technology. We believe this is because new ancient genre technologies contain some of the following:

1. a lack of customizability
2. a hard to learn combat system 
3. or a lack of combat depth 
3. not being open sourced

AET plans to change this by introducing a combat system which has almost no initial learning curve yet retains depth and is open sourced and easily customizable. Below you'll find some of planned features which we hope will set apart this system from others and lead it to widespread adoption.

## Game Components
### Config
> Files: { Config }
- This is where you can edit gametype (R15/R6), and enable or disable various toggleable game componnets. 
### Spring Camera
> Toggleable, Files: { SpringController.client }
- Players will be using a camera which uses the spring module to stimulate the motion of the camera being pushed away as the player moves faster and then drawn in when they decrease in movemenmt speed. Works well with sprinting as you get to see the spring in action. 
### Sprinting 
> Toggleable, Files: { SprintingService, SprintingController }
- Player should be able to toggle sprinting across the map. Sprinting will not have to interact with many modules of the game allowing it to easily be disabled and enabled by game devs. When sprinting your camera will use a spring 
### First Person


