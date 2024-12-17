პროექტში შევქმენი docker-compose.yml ფაილი, რომელიც განსაზღვრავს ორ სერვისს:

1. Node.js აპლიკაცია (app)
2. MongoDB ბაზა (db)

ფაილის შიგთავსი:

```yaml
yaml
Copy code
version: '3.8'

services:
  app:
    build: .
    container_name: node-app
    restart: always
    depends_on:
      - db
    ports:
      - "3000:3000"

  db:
    image: mongo:latest
    container_name: mongo-db
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

1. **`version`**: განსაზღვრავს **Docker Compose**-ის ვერსიას.
2. `services`: ეს არის სექცია, სადაც განისაზღვრება კონტეინერები (სერვისები), რომლებიც Docker Compose-მა უნდა გაუშვას.

**`app`**: სერვისის სახელი. ეს არის Node.js აპლიკაციის კონტეინერი.

**`build: .`**:  წერტილი მიუთითებს მიმდინარე დირექტორიას, საიდანაც შეიქმნება Docker image.

**`container_name`**: კონტეინერის სახელია **`node-app`**.

**`restart: always`**: კონტეინერი ავტომატურად გადაეშვება, თუ რომელიმე დაფეილდება.

`depends_on`: ეს სერვისი დამოკიდებულია `db` სერვისზე, რაც ნიშნავს, რომ MongoDB პირველი გაეშვება.

**`ports`**: პორტების განაკავშირებელი სექცია.

`"3000:3000"`: ჰოსტის 3000 პორტი უკავშირდება კონტეინერის 3000 პორტს.

**`db`** MongoDB სერვისის კონტეინერი.

**`image: mongo:latest`**: MongoDB-ს ოფიციალური Docker image-ის ბოლო ვერსია.

**`container_name`**: კონტეინერის სახელია **`mongo-db`**.

**`ports`**:

`"27017:27017"`: ჰოსტის 27017 პორტი უკავშირდება კონტეინერის 27017 პორტს, რაც საშუალებას იძლევა MongoDB იყოს ხელმისაწვდომი ჰოსტიდან.

**`volumes`**:

**`mongo-data:/data/db`**: მონაცემები ინახება `mongo-data` ვოლუმში, რათა კონტეინერის წაშლის შემდეგაც მონაცემები არ დაიკარგოს.

1. **`volumes`**: განსაზღვრავს ვოლუმს, რომელსაც MongoDB მონაცემების შესანახად იყენებს.
    
    **`mongo-data`**: ვოლუმის სახელია, რომელიც აკავშირებს კონტეინერის **`/data/db`** დირექტორიას ჰოსტთან.
    

### **სერვისების გაშვების და შემოწმების ნაბიჯები**

**კონტეინერების აგება და გაშვება**

```bash
docker-compose up -d
```

**გაშვებული კონტეინერების შემოწმება**

```bash
docker-compose ps
```

**3. აპლიკაციაზე წვდომა**

შეგვიძლია ბრაუზერშიც ვნახოთ:

```arduino
http://localhost:3000
```

**4. ლოგების შემოწმება**

```bash
docker-compose ps
docker logs node-app
```

ამ ბრძანების შემდეგ ტერმინალში უნდა დავინახოთ “App is running on [http://localhost:3000](http://localhost:3000/)”


### **`app.js`** ფაილის მოკლე აღწერა

---

1. მოდულების იმპორტი:
    - Express.js: ვებ-სერვერის ასაწყობად.
    - MongoClient: MongoDB ბაზასთან დასაკავშირებლად.
    
    ```jsx
    const express = require('express');
    const { MongoClient } = require('mongodb');
    ```
    
2. სერვერის კონფიგურაცია:
    - აპლიკაცია მუშაობს 3000 პორტზე.
    - MongoDB-ის URL და ბაზის სახელი განსაზღვრულია.
    
    ```jsx
    const app = express();
    const port = 3000;
    
    const url = 'mongodb://db:27017';
    const dbName = 'testdb';
    ```
    
3. MongoDB კავშირი და მონაცემების ჩაწერა/მოხსნა:
    - `client.connect()`: აპლიკაცია უკავშირდება MongoDB სერვისს.
    - კოლექციაში (`test`) ინსერტირდება ახალი დოკუმენტი.
    - `findOne({}, { sort: { _id: -1 } })`: მოაქვს ბოლო დოკუმენტი კოლექციიდან.
    
    ```jsx
    await collection.insertOne({ message: 'Hello, it is working!!!!' });
    const result = await collection.findOne({}, { sort: { _id: -1 } });
    ```
    
4. რაუტი `/`:
    - მთავარ გვერდზე სერვერი პასუხობს MongoDB-დან წამოღებული შეტყობინებით.
    
    ```jsx
    res.send(`Connected to MongoDB! Message: ${result.message}`);
    ```
    
5. სერვერის გაშვება:
    - აპლიკაცია ეშვება 3000 პორტზე და კონსოლში ბეჭდავს, რომ სერვერი გაშვებულია.
    
    ```jsx
    app.listen(port, () => {
      console.log(`App is running on http://localhost:${port}`);
    });
    ```
    
