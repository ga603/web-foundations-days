# Library API Design

## Books Resource Endpoints

* **List Books**
  * Method: `GET`
  * Path: `/books`
  * Description: Retrieves a list of all books in the library catalog.
  * Success Status: `200 OK`
* **Get One Book**
  * Method: `GET`
  * Path: `/books/{id}`
  * Description: Retrieves the details of a single book by its ID.
  * Success Status: `200 OK`
* **Create Book**
  * Method: `POST`
  * Path: `/books`
  * Description: Adds a new book to the library catalog.
  * Request Body: `{ "title": "Things Fall Apart", "author": "Chinua Achebe", "year": 1958 }`
  * Success Status: `201 Created`
* **Update Book**
  * Method: `PUT`
  * Path: `/books/{id}`
  * Description: Updates all properties of an existing book.
  * Request Body: `{ "title": "Things Fall Apart", "author": "Chinua Achebe", "year": 1959 }`
  * Success Status: `200 OK`
* **Delete Book**
  * Method: `DELETE`
  * Path: `/books/{id}`
  * Description: Removes a book from the library catalog.
  * Success Status: `204 No Content`
* **List Books by Author**
  * Method: `GET`
  * Path: `/books?author={authorName}`
  * Description: Retrieves a list of books filtered by a specific author.
  * Success Status: `200 OK`

## Common Error Codes

* **400 Bad Request:** Triggered when the client sends malformed data, such as trying to `POST /books` without providing a required `title` field in the JSON body.
* **404 Not Found:** Triggered when a requested resource does not exist, such as requesting `GET /books/999` when there is no book with ID 999 in the database.