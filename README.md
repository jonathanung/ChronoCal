
# ChronoCal

scripts:
```zsh
mkdir ChronoCal
cd ChronoCal
git init
git remote add https://github.com/jonathanung/ChronoCal
git pull
cd client
npm i
cd ../server
npm i
cd ..
```

The Backend and Front End will be booted in separate terminals.
```zsh
cd client
npm run dev
```

```zsh
cd server
npm start
```


Planned Features:

- Calendar generator to create a unique two-dimensional array for the currently displayed month using dayjs
- Implement full CRUD functionality for users to easily personalize events and calendars 
- Develop relations between events and calendars to allow for modular integration within the application
- Apply an expense attribute to allow easier tracking of finances
- Integrate sorting for events by time and calendars by creation
- Different Calendar Views
- Rebuild of sked V2. 
- AI Powered Task Creation
- Better Calendar CSS
- Todo List, with sticky notes. 
- ICS File Support. 
- Appointment Scheduling. 
- Weather Widget.
- Built in AI time planning
- Charts to show spending


- Speech to text AI creation?


- Expenses should have graphs to compare on a month - month and a week - week basis, with analytics.



Front End
- Next.js
- Tailwind CSS
- v0.dev
- Flowbite
- Axios

- Chart.js?
- Dayjs?


Back End
- Express
- MongoDB
- jsonwebtoken
- draw.io (ERD)

