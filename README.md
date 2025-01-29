NOTE: I was unsure whether or not the README had to be in English or not, just in case I am writing in English.

NOTE 2: As I explained in the video, due to not being able to make Render work I could not deploy the project and as such it needs to run locally. Here's a step by step guide on how to get it working:
- Download all the repos and put them into one folder (finals-frontend could be in a seperate folder)
- Make sure the docker-compose.yaml which is in this repo is in the root of that folder and not in any specific service
- Run "npm install"
- Run "docker-compose up --build"
- For frontend instead run "npm run dev"
- Ports for each service are: 3000 - gateway 3001 - doctor 3002 - pharmacy 3003 - medicine 3004 - auth
- For the gateway the link is http://localhost:3000/api/v1/[SERVICENAME]/v1/
- For the frontend the link is http://localhost:5173/doctor
- For RabbitMQ the link is http://localhost:15672/#/
- For MongoDB I recommend downloading MongoDB Compass if you want to view the data

Github Links (Due to the nature of Render I uploaded them as seperate repositories):

https://github.com/merisir573/finals-auth 

https://github.com/merisir573/finals-doctor (current one)

https://github.com/merisir573/finals-gateway 

https://github.com/merisir573/finals-medicine

https://github.com/merisir573/finals-pharmacy

https://github.com/merisir573/finals-frontend

Video Link:

https://youtu.be/4okENh2aR3E (NOTE: The video is send only, if it doesn't work, please send an E-Mail so I can change it to public)

---My Design---
For the most part the designs are pretty straightforward.

Gateway: Checks the path and redirects accordingly, makes sure to also pass headers (for authentication) and queries (for medication search)

Doctor: Takes the presented json and queues it. Requires authentication which is passed through the header with key "Authentication" and value "Bearer [ACCESSTOKEN]"

Pharmacy: Takes the presented json, checks to see if any message in the queue matches it and if so, pops from the queue. Requires authentication which is passed through the header with key "Authentication" and value "Bearer [ACCESSTOKEN]"

Medicine: On initialization scrapes the excel found in https://www.titck.gov.tr/dinamikmodul/43 and writes the name and status into MongoDB, a NoSQL database, which is then searched whenever a query is passed in. It also has pagination with each page showing 10 medication.

Auth: Uses JWT, the strategy it uses is to get "Bearer" +  access key which is generated upon a successful login. Keeps a repo of users which get registered upon a successful register. Uses username and password as its two values.

Frontend: Uses Tailwind for the CSS and Vite for the site. Uses textboxes for data which is jsonified and then upon a button press directs that data using the gateway. Upon a successful login the access key is kept so as to be passed into the gateway's header.

---Assumptions Made---

One assumption and design choice I made was to depricate the need for a prescription service, instead spreading it into doctor and pharmacy, from what I can tell this does not cause any issues as both are connected to the same RabbitMQ server.

---Issues I Encountered---

Unfortunately due to many issues that arose with Render I could not deploy the project, which is probably the worst issue I have encountered. Aside from that I do not understand mock APIs or how notifications work and as such I could not implement them.

Aside from what I couldn't implement, during development authentication was the biggest cause of issues, for some reason the header just wouldn't pass correctly, I eventually fixed this by specifyin I was passing in custom headers which excluded any standard headers that might've been causing issues.
