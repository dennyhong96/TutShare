# TutShare

### An online platform for sharing web devleopment study resources.

#### Built with React, Next.js, Redux, Sass, Nodejs, MongoDB, AWS (S3, EC2, SES)

## User stories:

#### As a user, I can:

- See trending study resources.
- Browse study resources by category.
- Register / Sign in to share study resources.
- Update / Delete study resources I shared.
- Set categories as my interests.
- Get email notifications when new study reources are shared that fits my interests.
- Use TutShare platform on all devices regardless of screen sizes.

#### As an admin, I can:

- Create new categories.
- Provide rich-text description and image for categories.
- Update / Delete categories.
- Share / Update / Delete study resources.

## Live Demo

[Deployed app on AWS EC2](http://ec2-54-71-94-255.us-west-2.compute.amazonaws.com/ "TutShare")

## Screenshot Previews

#### Home / Categories / Trending page

<img src="./previews/home.png" width="80%">
<img src="./previews/trendy.png" width="80%">
<img src="./previews/phone.png" width="25%">

#### Resources by category page

<img src="./previews/category.png" width="80%">
<img src="./previews/mongodb.png" width="25%">

#### User registration and multi-factor authentication with email

<img src="./previews/Register.png" width="80%">
<img src="./previews/MFA.png" width="80%">

#### User update profile page

<img src="./previews/updateuser.png" width="80%">

#### Share new resources / Receive email notification on interested categories

<img src="./previews/createresource.png" width="80%">
<img src="./previews/Email-Notification.png" width="80%">

#### Update / Delete resource

<img src="./previews/updateresource.png" width="80%">
<img src="./previews/deleteresource.png" width="80%">

#### Admin Dashboard - create && manage categories

<img src="./previews/createcate.png" width="80%">
<img src="./previews/admincate.png" width="80%">

## Installation

Use NPM:

```bash
cd client && npm i # install nextjs app dependencies
cd ..
cd server && npm i # install nodejs express app dependencies
```

## Usage

```python
cd server && npm start # start up server
# open up another terminal tab
cd client && npm run build # create nextjs production build
npm start # serve nextjs app
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
