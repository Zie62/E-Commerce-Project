# Mock E-commerce Site

https://no-rscripts.herokuapp.com/

This is a mock E-commerce site I coded from scratch utilizing the MERN stack (MongoDB, Express, React, Node.js) alongside supporting libraries and utilities such as Axios and Webpack. The site was hosted through Heroku(RIP free tier), and files are stored on Github as well as a local Git repository.

This site contains functionality to show items which are on sale (randomly generated sales daily), show all items "being sold" (no items are actually for sale as it is a sample), and maintain and display a cart with an indicator at the top of the screen to confirm when items are added to the cart. Each item on the site has a page for its self, procedurally generated utilizing the information stored in the database about them. Conditional HTML classes are used to display sales and other conditional content throughout the site.

Each item on the site is a "listing" in the database, and users carts are maintained in the database by utilizing randomly assigned 'uid' cookies to maintain parity between pages. The 'uid' cookie expires on session end, but alternatively I understand I could have added an expires property instead to allow users to come back to their cart later in a real implementation.

This project was started with a basic understanding of the libraries I used, but over the development I utilized documentation as well as Stack Overflow and other educational sources to continuously solve related implementation problems unlike those I had previously tackled when taking courses towards certifications. 
The design is simple, but I still decided to go through the design process and execute both mobile and desktop designs using figma as my design tool. Media queries are used to differentiate between mobile and desktop views, but the majority of the CSS is the same in both instances.

