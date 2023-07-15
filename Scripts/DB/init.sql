CREATE TABLE status_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    task_id INTEGER NOT NULL REFERENCES task(id),
    status_id INTEGER NOT NULL REFERENCES status(id),
    date_time INTEGER NOT NULL
);

CREATE TABLE task (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    project_id INTEGER NOT NULL REFERENCES project(id),
    summary VARCHAR NOT NULL,
    parent_id INTEGER NULL REFERENCES task(id)
);

CREATE TABLE project (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR
);

CREATE TABLE status (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    status VARCHAR NOT NULL
)