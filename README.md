# Shopify Challenge 2021 - Astrography
This project is my response to Shopify's Front End Developer Intern Challenge.

## Project Inspiration and Challenges
I took inspiration from Pinterest and studied masonry grids to achieve my desired look. Playing around with cookies
was a challenge as I had to wrap objects and store them into cookies and unwrap them into objects when the user re-visits the page.
This was achieved by retrieving a unique identifier from each APOD object and storing that string into the cookie. Once the user
re-visits the page, the application accesses the array in the cookie to match identifiers with the original array of posts. 

## Project Functionality
The project fetches a week's worth of images from NASA's APOD (Astronomy Picture of the Day) API on-load.
Users can then 'like' posts which will collectively be displayed on the 'Liked' tab.
They may also 'unlike' posts which will drop posts from the 'Liked' tab.
The heart display on the top right of each post will change according to being 'liked' or not. 
Users are also able to scroll down the page to view more APOD posts.
Each scroll to the bottom of the page will fetch another week's worth of NASA's APOD API.
Cookies are saved on the page, so if a user decides to revisit the page then their likes will be saved.

## Visit the Website
The project is live and hosted on Netlify at: https://goofy-boyd-2fa398.netlify.app/
​

