# TutShare

### An online platform for sharing web devleopment study resources.

#### Built with React, Next.js, Redux, Sass, Nodejs, MongoDB, AWS (S3, EC2, SES)

## User stories:

#### As a user, I can:

- See trending resources.
- Browse study resources by category.
- Register / Sign in to share resources.
- Update / Delete resources I shared.
- Set categories as my interests.
- Get email notifications when new reources are shared that fits my interests.
- Use TutShare platform on all devices regardless of screen sizes.

#### As an admin, I can:

- Create new categories.
- Provide rich-text description and image for categories.
- Update / Delete categories.
- Share / Update / Delete resources.

[Deployed app on AWS EC2](http://ec2-54-71-94-255.us-west-2.compute.amazonaws.com/ "TutShare").

## Previews

#### Home / Categories / Trending page

<img src="./previews/home.png" width="85%">
<img src="./previews/phone.png" width="25%">
<img src="./previews/trendy.png" width="85%">
<img src="./previews/phone2.png" width="25%">

#### Resources by category page

<img src="./previews/category.png" width="85%">
<img src="./previews/mongodb.png" width="25%">

#### User registration and multi-factor authentication with email

<img src="./previews/Register.png" width="85%">
<img src="./previews/MFA.png" width="85%">

#### User update profile page

<img src="./previews/updateuser.png" width="85%">

#### Share new resources / Receive email notification on interested categories

<img src="./previews/createresource.png" width="85%">
<img src="./previews/Email-Notification.png" width="85%">

#### Update / Delete resource

<img src="./previews/updateresource.png" width="85%">
<img src="./previews/deleteresource.png" width="85%">

#### Admin Dashboard - create && manage categories

<img src="./previews/createcate.png" width="85%">
<img src="./previews/admincate.png" width="85%">

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
