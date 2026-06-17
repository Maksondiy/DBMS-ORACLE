window.QUIZ_QUESTIONS = [
  {
    "source": "exam",
    "type": "theory",
    "question": "Global variables declared in a package specification:",
    "answers": [
      {
        "text": "Are visible only in the package body.",
        "isCorrect": false
      },
      {
        "text": "Are created at log-on and destroyed at commit.",
        "isCorrect": false
      },
      {
        "text": "Persist for the duration of the current session and can store state between calls to any subprogram in the package.",
        "isCorrect": true
      },
      {
        "text": "Persist for all sessions simultaneously.",
        "isCorrect": false
      },
      {
        "text": "Cannot be initialized in the declaration.",
        "isCorrect": false
      }
    ],
    "explanation": "Variables declared in a package specification (or body) are package-level \"global\" state: they are instantiated per session and keep their value for the whole session, so they carry state between successive calls to any subprogram of the package. They are not destroyed at `COMMIT`, and they are not shared across sessions (each session has its own copy).",
    "id": 1
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the PL/SQL block:\nSET SERVEROUTPUT ON\nDECLARE\n  CURSOR c IS SELECT department_id FROM departments;\n  v_id departments.department_id%TYPE;\nBEGIN\n  OPEN c;\n  DBMS_OUTPUT.PUT_LINE(c%ROWCOUNT);\n  FETCH c INTO v_id;\n  CLOSE c;\nEND;\nThe table exists and has rows. What will it display?",
    "answers": [
      {
        "text": "1",
        "isCorrect": false
      },
      {
        "text": "NULL",
        "isCorrect": false
      },
      {
        "text": "Raises INVALID_CURSOR exception",
        "isCorrect": false
      },
      {
        "text": "2",
        "isCorrect": false
      },
      {
        "text": "0",
        "isCorrect": true
      }
    ],
    "explanation": "Right after `OPEN c`, no row has been fetched yet, so `c%ROWCOUNT` is `0` (it counts rows returned by `FETCH` so far). It becomes 1 only after the first `FETCH`.",
    "id": 2,
    "annotations": [
      {
        "n": 1,
        "find": "DBMS_OUTPUT.PUT_LINE(c%ROWCOUNT)",
        "note": "Printed straight after OPEN, before any FETCH, so ROWCOUNT is still 0."
      }
    ],
    "walkthrough": [
      "`OPEN c` runs the query and positions the cursor before the first row — nothing is fetched yet.",
      "`c%ROWCOUNT` counts rows returned by `FETCH` so far, so it is `0`.",
      "`DBMS_OUTPUT.PUT_LINE(c%ROWCOUNT)` therefore prints `0`.",
      "Only the later `FETCH c INTO v_id` would make `c%ROWCOUNT` become `1`.",
      "Output: `0`."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "What will the following PL/SQL block display?\nSET SERVEROUTPUT ON\nDECLARE\n  TYPE t_ids IS TABLE OF employees.employee_id%TYPE;\n  v_ids t_ids := t_ids(101,102,103);\nBEGIN\n  FORALL i IN v_ids.FIRST .. v_ids.LAST\n    UPDATE employees\n      SET salary = salary + 50\n      WHERE employee_id = v_ids(i);\n  DBMS_OUTPUT.PUT_LINE(SQL%ROWCOUNT);\nEND;\nThe employees table exists and contains all three employees.",
    "answers": [
      {
        "text": "Raises VALUE_ERROR exception",
        "isCorrect": false
      },
      {
        "text": "NULL",
        "isCorrect": false
      },
      {
        "text": "3",
        "isCorrect": true
      },
      {
        "text": "1",
        "isCorrect": false
      },
      {
        "text": "Raises INVALID_CURSOR exception",
        "isCorrect": false
      }
    ],
    "explanation": "`FORALL` runs the `UPDATE` once for each of the three collection elements, each matching one employee. After a `FORALL`, `SQL%ROWCOUNT` is the *total* number of rows affected across all iterations = `3`.",
    "id": 3,
    "annotations": [
      {
        "n": 1,
        "find": "FORALL i IN v_ids.FIRST .. v_ids.LAST",
        "note": "Runs the UPDATE 3 times, one per collection element."
      },
      {
        "n": 2,
        "find": "SQL%ROWCOUNT",
        "note": "Total rows affected by the whole FORALL = 3."
      }
    ],
    "walkthrough": [
      "`v_ids` is a nested table holding three ids: `101`, `102`, `103`.",
      "`FORALL` hands all three `UPDATE`s to the SQL engine in a single context switch; each matches exactly one employee.",
      "After a `FORALL`, `SQL%ROWCOUNT` is the total rows affected across all iterations: `1 + 1 + 1 = 3`.",
      "Output: `3`."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which PL/SQL loop automatically handles OPEN, FETCH, and CLOSE operations for an explicit cursor?",
    "answers": [
      {
        "text": "FOR i IN 1..SQL%ROWCOUNT LOOP ... END LOOP",
        "isCorrect": false
      },
      {
        "text": "GOTO c%ROWCOUNT",
        "isCorrect": false
      },
      {
        "text": "WHILE ... LOOP ... END LOOP",
        "isCorrect": false
      },
      {
        "text": "LOOP ... EXIT WHEN ... END LOOP",
        "isCorrect": false
      },
      {
        "text": "FOR r IN c LOOP ... END LOOP",
        "isCorrect": true
      }
    ],
    "explanation": "The cursor `FOR` loop (`FOR r IN c LOOP ... END LOOP`) implicitly does the `OPEN`, the `FETCH` on every iteration, and the `CLOSE` at the end, and it also declares the record `r` automatically. The other loops require you to manage the cursor by hand.",
    "id": 4
  },
  {
    "source": "exam",
    "type": "code",
    "question": "What will the following block display?\nSET SERVEROUTPUT ON\nBEGIN\n  UPDATE employees\n    SET salary = salary + 10\n    WHERE department_id = 30;\n  IF SQL%ISOPEN THEN\n    DBMS_OUTPUT.PUT_LINE('Is opened');\n  ELSE\n    DBMS_OUTPUT.PUT_LINE('Is not opened');\n  END IF;\nEND;",
    "answers": [
      {
        "text": "Is opened",
        "isCorrect": false
      },
      {
        "text": "Compilation error",
        "isCorrect": false
      },
      {
        "text": "NULL",
        "isCorrect": false
      },
      {
        "text": "Raises INVALID_CURSOR exception",
        "isCorrect": false
      },
      {
        "text": "Is not opened",
        "isCorrect": true
      }
    ],
    "explanation": "Oracle opens and then automatically closes the implicit cursor for the `UPDATE` as part of running it, so by the time the `IF` is reached `SQL%ISOPEN` is always `FALSE`. The condition is not TRUE, so the `ELSE` branch runs and it prints `Is not opened`. (An implicit cursor is never open between statements — only explicit cursors stay open until you `CLOSE` them.)",
    "id": 5,
    "annotations": [
      {
        "n": 1,
        "find": "UPDATE employees",
        "note": "This DML uses the implicit (`SQL`) cursor, which Oracle opens and closes automatically as part of running the statement."
      },
      {
        "n": 2,
        "find": "SQL%ISOPEN",
        "note": "For an implicit cursor this is `always FALSE` — the cursor is never left open between statements."
      },
      {
        "n": 3,
        "find": "'Is not opened'",
        "note": "Because the `IF` is false, control falls to the `ELSE` and this line is printed."
      }
    ],
    "walkthrough": [
      "The `UPDATE` executes; Oracle opens and immediately closes its implicit cursor.",
      "`SQL%ISOPEN` for an implicit cursor is always `FALSE`.",
      "The `IF` condition is false, so the `ELSE` branch runs.",
      "Output: `Is not opened`."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Inside a trigger, the test IF INSERTING THEN ... is available:",
    "answers": [
      {
        "text": "Only in BEFORE statement triggers.",
        "isCorrect": false
      },
      {
        "text": "Only in compound triggers.",
        "isCorrect": false
      },
      {
        "text": "Only in AFTER triggers.",
        "isCorrect": false
      },
      {
        "text": "In any PL/SQL block.",
        "isCorrect": false
      },
      {
        "text": "In any trigger (row or statement) to distinguish the DML event that triggered it.",
        "isCorrect": true
      }
    ],
    "explanation": "The conditional predicates `INSERTING`, `UPDATING` and `DELETING` are available in any DML trigger — row or statement level — so a single trigger defined for several events can tell which DML fired it.",
    "id": 6
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following activities are specific to a DBMS:",
    "answers": [
      {
        "text": "query optimization",
        "isCorrect": true
      },
      {
        "text": "defining the database structure",
        "isCorrect": true
      },
      {
        "text": "data security",
        "isCorrect": true
      },
      {
        "text": "system administration",
        "isCorrect": true
      },
      {
        "text": "compiling programs written in a high-level language",
        "isCorrect": false
      }
    ],
    "explanation": "Query optimization, defining the database structure, data security and system administration are all jobs of a DBMS. Compiling programs written in a high-level language is the job of a language compiler, not the DBMS.",
    "id": 7
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following statements are true:",
    "answers": [
      {
        "text": "a PL/SQL block contains sequences of SQL commands",
        "isCorrect": true
      },
      {
        "text": "a PL/SQL block contains sequences of commands specific to PL/SQL",
        "isCorrect": true
      },
      {
        "text": "exceptions can be defined inside a PL/SQL block",
        "isCorrect": true
      },
      {
        "text": "a PL/SQL block contains only SQL commands",
        "isCorrect": false
      },
      {
        "text": "a PL/SQL block can contain nested PL/SQL blocks",
        "isCorrect": true
      }
    ],
    "explanation": "A PL/SQL block mixes `SQL` statements with PL/SQL-specific statements, lets you declare and handle exceptions, and can contain nested blocks. It does not contain *only* SQL — that is what makes it procedural.",
    "id": 8
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following statements are correct (question about cursors):",
    "answers": [
      {
        "text": "an implicit cursor is used",
        "isCorrect": false
      },
      {
        "text": "an iterative (loop) control structure is used",
        "isCorrect": true
      },
      {
        "text": "an explicit cursor is defined",
        "isCorrect": true
      },
      {
        "text": "the OPEN statement is used to open the cursor",
        "isCorrect": true
      },
      {
        "text": "the CLOSE statement is used to close the cursor",
        "isCorrect": true
      }
    ],
    "explanation": "The sequence works with an explicit cursor: it is declared with a name and driven by hand with `OPEN`, a `FETCH` inside a loop, and `CLOSE` — so an iterative (loop) control structure is also used. Because the cursor is named and managed manually it is explicit, not implicit (an implicit cursor is the one Oracle creates automatically for a DML statement or a `SELECT ... INTO`).",
    "id": 9
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "The %FOUND attribute characterizes:",
    "answers": [
      {
        "text": "an implicit cursor",
        "isCorrect": true
      },
      {
        "text": "an explicit cursor",
        "isCorrect": true
      },
      {
        "text": "a virtual table",
        "isCorrect": false
      },
      {
        "text": "a predefined exception",
        "isCorrect": false
      },
      {
        "text": "a record",
        "isCorrect": false
      }
    ],
    "explanation": "The `%FOUND` attribute exists for both implicit cursors (`SQL%FOUND`) and explicit cursors (`cursor%FOUND`). It is not a property of tables, exceptions or records.",
    "id": 10
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the PL/SQL block:\nDECLARE\n  exam_grade NUMBER;\nBEGIN\n  IF exam_grade >= 5 THEN\n    dbms_output.put_line('passed!');\n  ELSE\n    dbms_output.put_line('failed!');\n  END IF;\nEND;\nWhich of the following statements are WRONG:",
    "answers": [
      {
        "text": "it displays 'failed!'",
        "isCorrect": false
      },
      {
        "text": "it displays 'failed!' if the grade is less than 5 and 'passed!' otherwise",
        "isCorrect": true
      },
      {
        "text": "it displays 'passed!'",
        "isCorrect": true
      },
      {
        "text": "the block runs but displays nothing",
        "isCorrect": true
      },
      {
        "text": "an alternative (conditional) control structure is used",
        "isCorrect": false
      }
    ],
    "explanation": "The question asks which statements are WRONG. `exam_grade` is never initialised, so it is `NULL`; `NULL >= 5` evaluates to `NULL` (not TRUE), so the `ELSE` runs and the block prints `failed!`. Therefore the truly correct facts are \"it displays failed!\" and \"it uses a conditional structure\" (so those are NOT wrong). The wrong statements are: that it displays `passed!`, that it depends on the grade value, and that it displays nothing.",
    "id": 11,
    "annotations": [
      {
        "n": 1,
        "find": "IF exam_grade >= 5 THEN",
        "note": "exam_grade is uninitialised (NULL); NULL >= 5 is NULL, not TRUE."
      },
      {
        "n": 2,
        "find": "dbms_output.put_line('failed!')",
        "note": "The ELSE branch runs, so this is what prints."
      }
    ],
    "walkthrough": [
      "`exam_grade` is declared but never assigned, so its value is `NULL`.",
      "`NULL >= 5` evaluates to `NULL`, which is not `TRUE`.",
      "The `IF` takes the `ELSE` branch and prints `failed!`.",
      "So the WRONG statements are: it displays `passed!`, it depends on the grade, and it displays nothing."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following PL/SQL variable declarations are correct:",
    "answers": [
      {
        "text": "v_order_date DATE := SYSDATE;",
        "isCorrect": true
      },
      {
        "text": "v_name VARCHAR2(15) DEFAULT 'Ion';",
        "isCorrect": true
      },
      {
        "text": "v_first_name VARCHAR2(5) := 'Anastasia Nicoleta';",
        "isCorrect": false
      },
      {
        "text": "v_test BOOLEAN NOT NULL := FALSE;",
        "isCorrect": true
      },
      {
        "text": "v_salary NUMBER NOT NULL;",
        "isCorrect": false
      }
    ],
    "explanation": "Valid: `DATE := SYSDATE`, `VARCHAR2(15) DEFAULT 'Ion'`, and `BOOLEAN NOT NULL := FALSE` (a `NOT NULL` variable is fine as long as it is initialised). Invalid: assigning `'Anastasia Nicoleta'` to a `VARCHAR2(5)` (the literal is longer than the declared size), and `v_salary NUMBER NOT NULL;` with no initial value (a `NOT NULL` variable must be initialised).",
    "id": 12
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following command sequence:\nFOR i IN t.FIRST .. t.LAST LOOP\n  IF t.EXISTS(i) THEN\n    DBMS_OUTPUT.PUT_LINE(t(i));\n  END IF;\nEND LOOP;\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "EXISTS(i) denotes a method of the collection t",
        "isCorrect": true
      },
      {
        "text": "the FIRST and LAST values must be determined before the FOR structure by a query",
        "isCorrect": false
      },
      {
        "text": "to be used inside the FOR structure, the variable i must be declared in the declarative section",
        "isCorrect": false
      },
      {
        "text": "EXISTS(i) returns TRUE if element i of the collection exists",
        "isCorrect": true
      },
      {
        "text": "EXISTS(i) denotes a relational operator",
        "isCorrect": false
      }
    ],
    "explanation": "`EXISTS(i)` is a built-in collection *method* that returns `TRUE` when element `i` of the collection exists (and `FALSE` otherwise) — it is not a relational operator. `FIRST`/`LAST` are also collection methods, and the `FOR` loop counter `i` is declared implicitly, so it needs no declaration and no prior query.",
    "id": 13,
    "annotations": [
      {
        "n": 1,
        "find": "t.EXISTS(i)",
        "note": "A collection method returning TRUE if element i exists."
      }
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Consider the PL/SQL block (with 5 exception constructs: A, B, C, D, E). Which of the above are correct?",
    "answers": [
      {
        "text": "A: EXCEPTION WHEN NO_DATA_FOUND THEN stmts1; WHEN OTHERS THEN stmts2; END;",
        "isCorrect": true
      },
      {
        "text": "B: EXCEPTION WHEN TOO_MANY_ROWS THEN stmts1; END;",
        "isCorrect": true
      },
      {
        "text": "C: EXCEPTION WHEN NO_DATA_FOUND OR TOO_MANY_ROWS THEN stmts1; WHEN OTHERS THEN stmts3; END;",
        "isCorrect": true
      },
      {
        "text": "D: EXCEPTION WHEN OTHERS THEN stmts1; END;",
        "isCorrect": true
      },
      {
        "text": "E: EXCEPTION WHEN OTHERS THEN stmts1; WHEN NO_DATA_FOUND THEN stmts2; END;",
        "isCorrect": false
      }
    ],
    "explanation": "A, B, C and D are valid exception sections (`WHEN OTHERS` may appear, and combining names with `OR` is allowed). E is invalid because `WHEN OTHERS` must be the *last* handler — no specific handler (here `NO_DATA_FOUND`) may follow it.",
    "id": 14
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "The PL/SQL language does not directly support the commands:",
    "answers": [
      {
        "text": "ALTER",
        "isCorrect": true
      },
      {
        "text": "CREATE, DROP",
        "isCorrect": true
      },
      {
        "text": "COMMIT, SAVEPOINT",
        "isCorrect": false
      },
      {
        "text": "GRANT",
        "isCorrect": true
      },
      {
        "text": "DELETE, UPDATE",
        "isCorrect": false
      }
    ],
    "explanation": "PL/SQL does not directly support DDL (`CREATE`, `DROP`, `ALTER`) or DCL (`GRANT`) — those must be run through `EXECUTE IMMEDIATE`. DML (`DELETE`, `UPDATE`) and transaction control (`COMMIT`, `SAVEPOINT`) are supported directly.",
    "id": 15
  },
  {
    "source": "exam",
    "type": "code",
    "question": "What will the PL/SQL block display:\nDECLARE\n  CURSOR c IS SELECT last_name FROM employees;\n  r c%ROWTYPE;\nBEGIN\n  FETCH c INTO r;\n  DBMS_OUTPUT.PUT_LINE('The name is '||r.last_name);\nEXCEPTION\n  WHEN NO_DATA_FOUND THEN DBMS_OUTPUT.PUT_LINE('A');\n  WHEN OTHERS THEN DBMS_OUTPUT.PUT_LINE('B');\nEND;\n/",
    "answers": [
      {
        "text": "it will display the names of all employees",
        "isCorrect": false
      },
      {
        "text": "it will display B",
        "isCorrect": true
      },
      {
        "text": "it will raise an error",
        "isCorrect": false
      },
      {
        "text": "it will display A",
        "isCorrect": false
      },
      {
        "text": "it will display the name of the first employee",
        "isCorrect": false
      }
    ],
    "explanation": "The cursor `c` is never opened, so `FETCH c INTO r` raises an 'invalid cursor' error — not NO_DATA_FOUND. The inner handler only catches NO_DATA_FOUND, so it does not match; the error propagates to the `WHEN OTHERS` handler, which prints `B`.",
    "id": 16,
    "annotations": [
      {
        "n": 1,
        "find": "FETCH c INTO r;",
        "note": "The cursor `c` was never `OPEN`ed, so this raises `INVALID_CURSOR` (ORA-01001), not `NO_DATA_FOUND`."
      },
      {
        "n": 2,
        "find": "WHEN NO_DATA_FOUND THEN",
        "note": "Does not match an invalid-cursor error, so this handler is skipped."
      },
      {
        "n": 3,
        "find": "WHEN OTHERS THEN DBMS_OUTPUT.PUT_LINE('B')",
        "note": "The catch-all handler matches and prints `B`."
      }
    ],
    "walkthrough": [
      "`c` is declared but never `OPEN`ed.",
      "`FETCH c INTO r` raises `INVALID_CURSOR` (ORA-01001) — `FETCH`, not a `SELECT INTO`, so never `NO_DATA_FOUND`.",
      "`WHEN NO_DATA_FOUND` does not match; `WHEN OTHERS` catches the error.",
      "Output: `B`."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "From the following PL/SQL block structure:\nDECLARE\n  Statements;\nBEGIN\n  Statements;\nEXCEPTION\n  Statements;\nEND;",
    "answers": [
      {
        "text": "all parts are optional",
        "isCorrect": false
      },
      {
        "text": "the error-handling part is missing",
        "isCorrect": false
      },
      {
        "text": "only the executable part is mandatory",
        "isCorrect": true
      },
      {
        "text": "all parts are mandatory",
        "isCorrect": false
      },
      {
        "text": "only the declarative part is mandatory",
        "isCorrect": false
      }
    ],
    "explanation": "Only the executable part (`BEGIN ... END`) is mandatory. The declarative part (`DECLARE`) and the exception-handling part (`EXCEPTION`) are both optional.",
    "id": 17,
    "annotations": [
      {
        "n": 1,
        "find": "BEGIN",
        "note": "The executable section is the only required part of a block."
      }
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Consider the following constructs:\nA. EXCEPTION WHEN NO_DATA_FOUND THEN stmts1; WHEN OTHERS THEN stmts2; END;\nB. EXCEPTION WHEN TOO_MANY_ROWS THEN stmts1; END;\nC. EXCEPTION WHEN NO_DATA_FOUND THEN stmts1; WHEN NO_DATA_FOUND THEN stmts2; WHEN OTHERS THEN stmts3; END;\nD. EXCEPTION WHEN OTHERS THEN stmts1; END;\nE. EXCEPTION WHEN OTHERS THEN stmts1; WHEN NO_DATA_FOUND THEN stmts2; END;\nWhich of the above are correct?",
    "answers": [
      {
        "text": "A",
        "isCorrect": true
      },
      {
        "text": "D",
        "isCorrect": true
      },
      {
        "text": "B",
        "isCorrect": true
      },
      {
        "text": "E",
        "isCorrect": false
      },
      {
        "text": "C",
        "isCorrect": false
      }
    ],
    "explanation": "A, B and D are valid. C is wrong because it lists `WHEN NO_DATA_FOUND` twice (a handler may not be duplicated). E is wrong because `WHEN OTHERS` must be the last handler, so nothing may follow it.",
    "id": 18,
    "annotations": [
      {
        "n": 1,
        "find": "WHEN NO_DATA_FOUND THEN stmts1; WHEN NO_DATA_FOUND THEN stmts2;",
        "note": "Construct C lists the same handler twice — a handler may not be duplicated, so C is invalid."
      },
      {
        "n": 2,
        "find": "WHEN OTHERS THEN stmts1; WHEN NO_DATA_FOUND THEN stmts2;",
        "note": "Construct E puts `WHEN OTHERS` before a specific handler — `WHEN OTHERS` must be last, so E is invalid."
      }
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "For a cursor used in a FOR loop, the explicit operations that are eliminated are:",
    "answers": [
      {
        "text": "opening the cursor",
        "isCorrect": true
      },
      {
        "text": "closing the cursor",
        "isCorrect": true
      },
      {
        "text": "loading data from the current cursor row into variables",
        "isCorrect": true
      },
      {
        "text": "declaring the cursor",
        "isCorrect": false
      },
      {
        "text": "optimizing the cursor",
        "isCorrect": false
      }
    ],
    "explanation": "A cursor `FOR` loop removes the need to explicitly `OPEN` the cursor, `FETCH` each row into variables, and `CLOSE` the cursor — Oracle does all three for you. You still have to declare the cursor.",
    "id": 19
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the PL/SQL block:\nCREATE OR REPLACE PROCEDURE avg_sal (p_avg_sal OUT NUMBER)\nIS\nBEGIN\n  SELECT AVG(salary) INTO p_avg_sal FROM employees;\nEND;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "it raises an error because the RETURN command is missing",
        "isCorrect": false
      },
      {
        "text": "it raises an error because the SELECT command has an incorrect structure",
        "isCorrect": false
      },
      {
        "text": "a subprogram is created",
        "isCorrect": true
      },
      {
        "text": "a group function is used in the commands of the procedure body",
        "isCorrect": true
      },
      {
        "text": "the procedure receives an output parameter",
        "isCorrect": true
      }
    ],
    "explanation": "This creates a subprogram (a procedure) with an `OUT` parameter, and its body uses the group function `AVG`. A procedure does not use `RETURN` to return a value (that is for functions), and the `SELECT ... INTO` is correctly written, so there is no error.",
    "id": 20,
    "annotations": [
      {
        "n": 1,
        "find": "p_avg_sal OUT NUMBER",
        "note": "The procedure returns its result through an OUT parameter."
      },
      {
        "n": 2,
        "find": "AVG(salary)",
        "note": "A group (aggregate) function used in the body."
      }
    ],
    "walkthrough": [
      "The procedure compiles and is created — no execution output by itself.",
      "`p_avg_sal` is an `OUT` parameter; `SELECT AVG(salary) INTO p_avg_sal` is a valid single-row `SELECT INTO`.",
      "A procedure returns values through `OUT` parameters, so no `RETURN value` is needed.",
      "Result: a valid subprogram with an `OUT` parameter using the group function `AVG`."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the PL/SQL block below. The tables exist, have the referenced columns and at least 10 rows each. Some departments have employees, others do not.\n\nDECLARE\n  CURSOR c IS SELECT DEPT_NAME, COUNT(EMPLOYEE_ID) NR_EMP\n  FROM EMPLOYEES A RIGHT JOIN DEPARTMENTS D ON A.DEPARTMENT_ID=D.DEPARTMENT_ID\n  GROUP BY DEPT_NAME\n  ORDER BY COUNT(EMPLOYEE_ID) DESC;\n  r c%ROWTYPE;\nBEGIN\n  OPEN c;\n  DBMS_OUTPUT.PUT_LINE('Number of elements '||c%ROWCOUNT);\n  LOOP\n    FETCH c INTO r;\n    EXIT WHEN c%NOTFOUND;\n    IF r.NR_EMP=1 THEN\n      DBMS_OUTPUT.PUT_LINE(r.DEPT_NAME||' HAS ONE EMPLOYEE');\n    ELSIF r.NR_EMP=0 THEN\n      DBMS_OUTPUT.PUT_LINE(r.DEPT_NAME||' HAS NO EMPLOYEES');\n    ELSE\n      DBMS_OUTPUT.PUT_LINE(r.DEPT_NAME||' HAS '|| r.NR_EMP||' EMPLOYEES');\n    END IF;\n  END LOOP;\n  DBMS_OUTPUT.PUT_LINE('Number of elements '||c%ROWCOUNT);\n  CLOSE c;\n  OPEN c;\n  FETCH c INTO r;\n  FETCH c INTO r;\n  DBMS_OUTPUT.PUT_LINE(r.DEPT_NAME||' HAS '|| r.NR_EMP||' EMPLOYEES');\nEND;\n/\n\nWhich of the following statements are true?",
    "answers": [
      {
        "text": "The PL/SQL block contains an error and will not compile",
        "isCorrect": false
      },
      {
        "text": "The statement on line 10 will always display \"Number of elements 0\" and the statement on line 26 can raise the NO_DATA_FOUND exception",
        "isCorrect": false
      },
      {
        "text": "The statement on line 27 can raise the NO_DATA_FOUND exception",
        "isCorrect": false
      },
      {
        "text": "The statement on line 10 will always display \"Number of elements 0\"",
        "isCorrect": true
      }
    ],
    "explanation": "The first `PUT_LINE` runs right after `OPEN c`, before any `FETCH`, so `c%ROWCOUNT` is always `0`. The two later `FETCH c INTO r` statements cannot raise `NO_DATA_FOUND` — `FETCH` simply sets `%NOTFOUND`; only `SELECT ... INTO` raises `NO_DATA_FOUND`. The block compiles fine.",
    "id": 21,
    "annotations": [
      {
        "n": 1,
        "find": "DBMS_OUTPUT.PUT_LINE('Number of elements '||c%ROWCOUNT)",
        "note": "Runs immediately after OPEN, before any FETCH, so ROWCOUNT = 0."
      }
    ],
    "walkthrough": [
      "`OPEN c` runs the query; no `FETCH` has happened yet, so `c%ROWCOUNT` is `0`.",
      "The first `PUT_LINE` (line 10) therefore always prints `Number of elements 0`.",
      "The loop then fetches and classifies each department row.",
      "The later `FETCH c INTO r` statements only set `%NOTFOUND`; they can never raise `NO_DATA_FOUND` (only `SELECT INTO` does).",
      "So only statement C is true and the block compiles fine."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "In Oracle PL/SQL, to be able to run the statement that drops a table we use:",
    "answers": [
      {
        "text": "CALL",
        "isCorrect": false
      },
      {
        "text": "ALTER",
        "isCorrect": false
      },
      {
        "text": "EXECUTE IMMEDIATE",
        "isCorrect": true
      },
      {
        "text": "DROP",
        "isCorrect": false
      },
      {
        "text": "DELETE",
        "isCorrect": false
      }
    ],
    "explanation": "DDL such as `DROP TABLE` cannot be written directly in PL/SQL; it must be run dynamically with `EXECUTE IMMEDIATE`.",
    "id": 22
  },
  {
    "source": "exam",
    "type": "code",
    "question": "DECLARE\n  full_name VARCHAR2(300);\nBEGIN\n  SELECT last_name||' '||first_name AS full_name FROM Employees\n  WHERE employee_id=101;\n  DBMS_OUTPUT.PUT_LINE(full_name);\nEND;\n/\n\nWhich statement is correct?",
    "answers": [
      {
        "text": "the block uses a group operator",
        "isCorrect": false
      },
      {
        "text": "the block will display the full name of the employee with employee_id = 101 (if it exists)",
        "isCorrect": false
      },
      {
        "text": "the block contains an error and will not run",
        "isCorrect": true
      },
      {
        "text": "the block will display the NULL value",
        "isCorrect": false
      },
      {
        "text": "the block uses an explicit cursor",
        "isCorrect": false
      }
    ],
    "explanation": "The block does not compile: a `SELECT` inside PL/SQL must have an `INTO` clause to receive the values. Here the `SELECT last_name||' '||first_name` has no `INTO full_name`, which is a syntax error.",
    "id": 23,
    "annotations": [
      {
        "n": 1,
        "find": "SELECT last_name||' '||first_name AS full_name FROM Employees",
        "note": "No INTO clause — illegal in PL/SQL, so the block will not compile."
      }
    ],
    "walkthrough": [
      "Inside PL/SQL every `SELECT` must have an `INTO` clause to receive its columns.",
      "Here `SELECT last_name||' '||first_name` has no `INTO full_name`.",
      "This is a compile-time (PLS) error, so the block never runs.",
      "Result: the block contains an error and will not run."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "What is an implicit cursor in PL/SQL?",
    "answers": [
      {
        "text": "It is a cursor created and managed automatically by Oracle Database whenever a DML statement is executed.",
        "isCorrect": true
      },
      {
        "text": "It is a cursor used only in stored procedures and functions.",
        "isCorrect": false
      },
      {
        "text": "It is a cursor created by the user to handle complex SELECTs that return multiple rows.",
        "isCorrect": false
      },
      {
        "text": "It is a cursor that can be used to iterate through the results of an SQL query.",
        "isCorrect": false
      },
      {
        "text": "It is a cursor that does not require explicit opening, but requires explicit closing.",
        "isCorrect": false
      }
    ],
    "explanation": "An implicit cursor is created and managed automatically by Oracle for every DML statement (and single-row `SELECT INTO`). You do not open, fetch or close it; you only read its attributes via `SQL%...`.",
    "id": 24
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which operators are used in PL/SQL conditional expressions?",
    "answers": [
      {
        "text": "^, *, /",
        "isCorrect": false
      },
      {
        "text": "ADD, SUB, MULT",
        "isCorrect": false
      },
      {
        "text": "AND, OR, NOT",
        "isCorrect": true
      },
      {
        "text": ">, <, =",
        "isCorrect": false
      },
      {
        "text": "&&, [], !",
        "isCorrect": false
      }
    ],
    "explanation": "PL/SQL conditional (logical) expressions use the operators `AND`, `OR` and `NOT`. The others are arithmetic/relational symbols or invalid operators.",
    "id": 25
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the block below. The table exists, has the referenced columns and at least 10 rows.\n\nSET SERVEROUTPUT ON\nDECLARE\n  a NUMBER(7);\n  b NUMBER(7);\n  T BOOLEAN DEFAULT FALSE;\nBEGIN\n  IF NOT T THEN\n    (a,b):=SELECT SUM(SALARY),MAX(SALARY) FROM EMPLOYEES;\n    dbms_output.put_line('a='||a);\n    dbms_output.put_line('b='||b);\n  ELSE\n    dbms_output.put_line('Something else');\n  END IF;\nEND;\n/\n\nWhat will be the result of running the block?",
    "answers": [
      {
        "text": "The values of a and b are displayed",
        "isCorrect": false
      },
      {
        "text": "The block does not compile",
        "isCorrect": true
      },
      {
        "text": "It displays 'Something else'",
        "isCorrect": false
      },
      {
        "text": "The block uses an iterative structure",
        "isCorrect": false
      },
      {
        "text": "The block runs and an exception is raised",
        "isCorrect": false
      }
    ],
    "explanation": "The block does not compile: `(a,b) := SELECT ...` is not valid PL/SQL. To read query results into variables you must use `SELECT SUM(salary), MAX(salary) INTO a, b FROM employees;`.",
    "id": 26,
    "annotations": [
      {
        "n": 1,
        "find": "(a,b):=SELECT SUM(SALARY),MAX(SALARY) FROM EMPLOYEES",
        "note": "Invalid syntax — use SELECT ... INTO a, b instead."
      }
    ],
    "walkthrough": [
      "`T` is `FALSE`, so `NOT T` is `TRUE` and the `THEN` branch is parsed.",
      "`(a,b) := SELECT SUM(SALARY),MAX(SALARY) FROM EMPLOYEES;` is not valid PL/SQL syntax.",
      "Reading query results into variables requires `SELECT ... INTO a, b`.",
      "Result: the block does not compile."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following PL/SQL block:\nSET SERVEROUTPUT ON\nDECLARE\n  CURSOR cursor1 IS SELECT employee_id, last_name FROM Employees;\n  vid employees.employee_id%TYPE;\n  vname CHAR(20);\nBEGIN\n  OPEN cursor1;\n  WHILE cursor1%FOUND LOOP\n    FETCH cursor1 INTO vid, vname;\n    DBMS_OUTPUT.PUT_LINE('Employee '||vname);\n  END LOOP;\nEND;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "the PL/SQL block is erroneous",
        "isCorrect": false
      },
      {
        "text": "it works with an explicit cursor",
        "isCorrect": true
      },
      {
        "text": "the block is correct but displays nothing",
        "isCorrect": true
      },
      {
        "text": "it sequentially traverses an internal memory area",
        "isCorrect": true
      },
      {
        "text": "it works with an implicit cursor",
        "isCorrect": false
      }
    ],
    "explanation": "It is a valid block using an explicit cursor that sequentially traverses an in-memory result area. But the loop is `WHILE cursor1%FOUND` *before* the first `FETCH`: at that point `%FOUND` is `NULL`, so the `WHILE` condition is not TRUE and the loop body never runs — the block is correct but displays nothing.",
    "id": 27,
    "annotations": [
      {
        "n": 1,
        "find": "WHILE cursor1%FOUND LOOP",
        "note": "Before the first FETCH, %FOUND is NULL, so the loop never starts."
      }
    ],
    "walkthrough": [
      "`OPEN cursor1` succeeds, but no `FETCH` has run yet, so `cursor1%FOUND` is `NULL`.",
      "`WHILE cursor1%FOUND` tests the condition before the first `FETCH`; `NULL` is not `TRUE`.",
      "The loop body never executes.",
      "Result: a valid block that displays nothing (the `FETCH` should come before the `%FOUND` test)."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following PL/SQL sequence:\nCREATE OR REPLACE PACKAGE p_employees\nIS\n  v_total NUMBER;\n  FUNCTION FIND_EMP(p_employee_id employees.employee_id%TYPE) RETURN employees.last_name%TYPE;\n  FUNCTION FIND_EMP(p_name employees.last_name%TYPE, p_dept_id departments.department_id%TYPE)\n    RETURN employees.salary%TYPE;\nEND;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "the package functions are overloaded",
        "isCorrect": true
      },
      {
        "text": "the package does not compile successfully because the FIND_EMP functions have the same name",
        "isCorrect": false
      },
      {
        "text": "the package does not compile successfully because the BODY keyword is missing",
        "isCorrect": false
      },
      {
        "text": "the variable v_total is public and can be accessed as: p_employees.v_total",
        "isCorrect": true
      },
      {
        "text": "overloading is not allowed in this context",
        "isCorrect": false
      }
    ],
    "explanation": "The two `FIND_EMP` functions have the same name but different parameter lists, which is valid overloading inside a package. A package specification compiles on its own (the `BODY` is created separately), and `v_total` is a public variable accessible as `p_employees.v_total`.",
    "id": 28,
    "annotations": [
      {
        "n": 1,
        "find": "FUNCTION FIND_EMP",
        "note": "Same name, different parameters = overloading, allowed in a package."
      }
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following command sequence:\nCREATE OR REPLACE FUNCTION f_emp_seniority\n  (p_hire_date IN employees.hire_date%TYPE)\nRETURN NUMBER\nIS\nBEGIN\n  RETURN to_number(round((sysdate-p_hire_date)/365,0));\nEND f_emp_seniority;\n/\nSELECT employee_id, last_name, first_name, f_emp_seniority(hire_date)\nFROM employees\nWHERE f_emp_seniority(hire_date)>10;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "the function returns the number of days between the current date and the date received as a parameter",
        "isCorrect": false
      },
      {
        "text": "the function returns the number of years between the current date and the date received as a parameter",
        "isCorrect": true
      },
      {
        "text": "an error is generated because the function cannot be used in a SELECT command",
        "isCorrect": false
      },
      {
        "text": "the SELECT statement displays the seniority in days of employees with more than 10 days of seniority",
        "isCorrect": false
      },
      {
        "text": "the SELECT statement displays the seniority in years of employees with more than 10 years of seniority",
        "isCorrect": true
      }
    ],
    "explanation": "`round((sysdate - p_hire_date)/365, 0)` converts a difference in days to whole *years*, so the function returns seniority in years. Because it takes only an `IN` parameter and returns a value, it can be called inside a `SELECT`, which then lists employees with more than 10 years of seniority.",
    "id": 29,
    "annotations": [
      {
        "n": 1,
        "find": "round((sysdate-p_hire_date)/365,0)",
        "note": "Days divided by 365 then rounded = seniority in years."
      }
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following functions or statements cannot be used directly inside a PL/SQL assignment statement:",
    "answers": [
      {
        "text": "SUBSTR",
        "isCorrect": false
      },
      {
        "text": "MAX",
        "isCorrect": true
      },
      {
        "text": "DECODE",
        "isCorrect": true
      },
      {
        "text": "NVL",
        "isCorrect": false
      },
      {
        "text": "MIN",
        "isCorrect": true
      }
    ],
    "explanation": "Group (aggregate) functions like `MAX` and `MIN`, and the SQL-only function `DECODE`, cannot appear in a purely procedural PL/SQL assignment — they are only valid inside a SQL statement. `SUBSTR` and `NVL` are single-row functions and can be used directly in PL/SQL.",
    "id": 30
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following PL/SQL block:\nSET SERVEROUTPUT ON\nDECLARE\n  p customers%ROWTYPE;\n  CURSOR c IS SELECT * FROM customers WHERE credit_limit > 1000\n    ORDER BY credit_limit DESC;\nBEGIN\n  FOR p IN c LOOP\n    DBMS_OUTPUT.PUT_LINE('customer '||p.customer_name||' has credit limit: '||p.credit_limit);\n    EXIT WHEN p%ROWCOUNT>=5;\n  END LOOP;\nEND;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "the block will display an error because you cannot EXIT from a FOR loop",
        "isCorrect": false
      },
      {
        "text": "the block displays a top 5 of customers with the highest credit limit",
        "isCorrect": false
      },
      {
        "text": "the block will not execute because the variable p is not used correctly",
        "isCorrect": true
      },
      {
        "text": "the block uses an explicit cursor that traverses customers with credit limit greater than 1000",
        "isCorrect": true
      },
      {
        "text": "the block uses a record-type variable",
        "isCorrect": true
      }
    ],
    "explanation": "It uses an explicit cursor over customers with `credit_limit > 1000` and (via the loop) a record variable. But it will not run correctly: the cursor `FOR` loop implicitly redeclares `p` as its record, and `EXIT WHEN p%ROWCOUNT >= 5` is wrong — `%ROWCOUNT` is a *cursor* attribute (`c%ROWCOUNT`), not a record attribute.",
    "id": 31,
    "annotations": [
      {
        "n": 1,
        "find": "EXIT WHEN p%ROWCOUNT>=5",
        "note": "p is the loop record, not the cursor; %ROWCOUNT must be c%ROWCOUNT."
      }
    ],
    "walkthrough": [
      "The cursor `FOR` loop `FOR p IN c` implicitly declares its own record `p`, shadowing the declared `p`.",
      "`EXIT WHEN p%ROWCOUNT >= 5` then references `%ROWCOUNT` on the record `p`.",
      "`%ROWCOUNT` is a cursor attribute (`c%ROWCOUNT`), not a record attribute — this is an error.",
      "Result: the block will not run correctly."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following PL/SQL block:\nSET SERVEROUTPUT ON\nDECLARE\n  percent NUMBER(2);\nBEGIN\n  percent:=15;\n  UPDATE Employees\n  SET salary=salary*percent/100\n  WHERE employee_id=120;\n  ROLLBACK;\nEXCEPTION\n  WHEN OTHERS THEN\n    DBMS_OUTPUT.PUT_LINE(SQLERRM);\nEND;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "the ROLLBACK command is not allowed in a PL/SQL block",
        "isCorrect": false
      },
      {
        "text": "the block performs an update operation",
        "isCorrect": true
      },
      {
        "text": "the UPDATE command is allowed in a PL/SQL block",
        "isCorrect": true
      },
      {
        "text": "the value of an implicit cursor attribute is displayed",
        "isCorrect": false
      },
      {
        "text": "the no_data_found exception can occur if the employee with id 120 is not found",
        "isCorrect": false
      }
    ],
    "explanation": "The block performs an `UPDATE` (allowed in PL/SQL) and then a `ROLLBACK` (also allowed). It does not display any cursor attribute, and an `UPDATE` that matches no row does not raise `NO_DATA_FOUND` (it just sets `SQL%ROWCOUNT` to 0).",
    "id": 32,
    "annotations": [
      {
        "n": 1,
        "find": "UPDATE Employees",
        "note": "A DML `UPDATE` is allowed directly in a PL/SQL block."
      },
      {
        "n": 2,
        "find": "ROLLBACK;",
        "note": "Transaction control (`ROLLBACK`/`COMMIT`) is also allowed in a PL/SQL block; this undoes the update."
      },
      {
        "n": 3,
        "find": "SQLERRM",
        "note": "Only printed if an exception occurs — but an `UPDATE` matching no row is not an error, so nothing is printed here."
      }
    ],
    "walkthrough": [
      "`percent := 15` then the `UPDATE` runs (allowed in PL/SQL); if employee 120 exists its salary changes.",
      "`ROLLBACK` undoes the update — also allowed in a block.",
      "An `UPDATE` matching no row is not an error and never raises `NO_DATA_FOUND`; it just sets `SQL%ROWCOUNT` to 0.",
      "No exception occurs, so the `WHEN OTHERS` / `SQLERRM` handler does not run."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following PL/SQL block:\nCREATE OR REPLACE FUNCTION show_salary (v_id employees.employee_id%TYPE)\nRETURN NUMBER\nDECLARE\n  v_sal NUMBER(8,2);\nBEGIN\n  SELECT salary INTO v_sal FROM employees WHERE employee_id=v_id;\nEXCEPTION\n  WHEN no_data_found THEN RETURN -1;\n  WHEN too_many_rows THEN RETURN -2;\n  WHEN others THEN RETURN 0;\nEND;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "the block incorrectly defines a local variable",
        "isCorrect": false
      },
      {
        "text": "the function raises an error because the exceptions are not handled properly",
        "isCorrect": false
      },
      {
        "text": "the function raises an error because it does not return the salary value",
        "isCorrect": true
      },
      {
        "text": "the function raises an error because the parameter is incorrectly specified",
        "isCorrect": false
      },
      {
        "text": "the block creates a subprogram",
        "isCorrect": true
      }
    ],
    "explanation": "It does create a subprogram, but the function is faulty: a function must `RETURN` a value on its normal execution path, and here the body only returns inside the exception handlers — after a successful `SELECT ... INTO` there is no `RETURN v_sal`, so the value is never returned.",
    "id": 33,
    "annotations": [
      {
        "n": 1,
        "find": "SELECT salary INTO v_sal FROM employees WHERE employee_id=v_id;",
        "note": "On success there is no RETURN of v_sal afterwards — a function must return a value."
      }
    ],
    "walkthrough": [
      "A function must `RETURN` a value on its normal (non-exception) execution path.",
      "After a successful `SELECT salary INTO v_sal`, there is no `RETURN v_sal`.",
      "The body only returns inside the exception handlers, so on success no value is returned.",
      "Result: a subprogram is created but it is faulty — the salary is never returned."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following PL/SQL block:\nDECLARE\n  data VARCHAR2(25);\n  v NUMBER(2);\nBEGIN\n  SELECT sysdate-30 INTO data FROM dual\n  WHERE 1=2;\n  DBMS_OUTPUT.PUT_LINE(data);\nEXCEPTION\n  WHEN NO_DATA_FOUND THEN\n    DBMS_OUTPUT.PUT_LINE(v);\nEND;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "an error occurs because the variable data is of type VARCHAR",
        "isCorrect": false
      },
      {
        "text": "a number of days is displayed",
        "isCorrect": false
      },
      {
        "text": "an exception occurs and is handled properly",
        "isCorrect": true
      },
      {
        "text": "the block executes successfully but displays nothing",
        "isCorrect": true
      },
      {
        "text": "a calendar date is displayed",
        "isCorrect": false
      }
    ],
    "explanation": "The `WHERE 1=2` makes the `SELECT ... INTO` return zero rows, which raises `NO_DATA_FOUND`. That exception is caught by the handler, which prints `v` — but `v` was never assigned, so it is `NULL` and an empty line is shown. So the exception is handled properly and the block effectively displays nothing.",
    "id": 34,
    "annotations": [
      {
        "n": 1,
        "find": "WHERE 1=2",
        "note": "Always false, so SELECT INTO returns no rows and raises NO_DATA_FOUND."
      },
      {
        "n": 2,
        "find": "DBMS_OUTPUT.PUT_LINE(v)",
        "note": "v is uninitialised (NULL), so this prints a blank line."
      }
    ],
    "walkthrough": [
      "`WHERE 1=2` is never true, so the `SELECT ... INTO data` returns zero rows.",
      "Zero rows from a `SELECT INTO` raises `NO_DATA_FOUND`.",
      "The handler catches it and prints `v`, but `v` was never assigned, so it is `NULL`.",
      "Output: an empty line — the exception is handled and effectively nothing is displayed."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "A relational DBMS ensures data integrity through:",
    "answers": [
      {
        "text": "automatic data recovery procedures in case of incidents",
        "isCorrect": true
      },
      {
        "text": "transaction management mechanisms",
        "isCorrect": true
      },
      {
        "text": "encryption procedures",
        "isCorrect": false
      },
      {
        "text": "special data access procedures",
        "isCorrect": false
      },
      {
        "text": "the use of virtual tables",
        "isCorrect": false
      }
    ],
    "explanation": "A relational DBMS protects data integrity through transaction management (atomic, consistent commits/rollbacks) and automatic recovery procedures after failures. Encryption and access procedures are about security/access, not integrity, and virtual tables (views) are unrelated.",
    "id": 35
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the trigger t_check_stock:\nCREATE OR REPLACE TRIGGER t_check_stock\nBEFORE INSERT ON order_lines\nFOR EACH ROW\nDECLARE\n  v_stock stock.stock%TYPE;\nBEGIN\n  SELECT stock INTO v_stock FROM stock WHERE product_id=:new.product_id;\n  IF :new.quantity > v_stock THEN\n    :new.quantity:=v_stock;\n  END IF;\n  UPDATE stock\n  SET stock=stock-:new.quantity\n  WHERE product_id=:new.product_id;\nEND;\n/\nINSERT INTO order_lines VALUES(2392, 3110, 7, 20);\nROLLBACK;\n\nSpecify which of the following statements are true:",
    "answers": [
      {
        "text": "the trigger will adjust the ordered quantity according to the available stock",
        "isCorrect": true
      },
      {
        "text": "the ROLLBACK statement cancels both the INSERT operation and the update performed inside the trigger",
        "isCorrect": true
      },
      {
        "text": "the ROLLBACK statement will cancel only the INSERT operation",
        "isCorrect": false
      },
      {
        "text": "the update operation is not allowed inside the trigger",
        "isCorrect": false
      },
      {
        "text": "the no_data_found exception that may occur at the SELECT statement must be handled inside the trigger",
        "isCorrect": false
      }
    ],
    "explanation": "The `BEFORE INSERT ... FOR EACH ROW` trigger caps the ordered quantity at the available stock and then updates stock. The `INSERT` and the trigger's `UPDATE` are part of the *same* transaction, so the `ROLLBACK` afterwards cancels both.",
    "id": 36,
    "annotations": [
      {
        "n": 1,
        "find": ":new.quantity:=v_stock",
        "note": "Adjusts the ordered quantity down to the available stock."
      },
      {
        "n": 2,
        "find": "ROLLBACK",
        "note": "Undoes both the INSERT and the trigger's UPDATE — one transaction."
      }
    ],
    "walkthrough": [
      "The `BEFORE INSERT ... FOR EACH ROW` trigger reads the available stock for the product.",
      "If the ordered quantity exceeds stock, it caps `:new.quantity` at the available stock.",
      "It then updates `stock` for that product.",
      "The `INSERT` and the trigger's `UPDATE` are one transaction, so the following `ROLLBACK` cancels both."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the command sequence:\nCREATE OR REPLACE TRIGGER t_salary\nAFTER UPDATE OF job_id ON employees FOR EACH ROW\nBEGIN\n  INSERT INTO job_history VALUES\n    (:old.employee_id, :old.hire_date, SYSDATE, :old.job_id, :old.department_id);\n  COMMIT;\nEND;\n/\nUPDATE Employees\nSET job_id='IT_DEV'\nWHERE department_id=50;\n\nAssuming that in the Employees table 20 employees work in department 50, specify which of the statements is true:",
    "answers": [
      {
        "text": "the trigger is created with compilation errors",
        "isCorrect": false
      },
      {
        "text": "the COMMIT statement inside the trigger will finalize both DML commands (INSERT and UPDATE)",
        "isCorrect": false
      },
      {
        "text": "the trigger compiles successfully but an error will occur when executing the DML operation",
        "isCorrect": true
      },
      {
        "text": "the COMMIT statement is not allowed in the trigger in this context",
        "isCorrect": true
      },
      {
        "text": "the INSERT statement inside the trigger finalizes independently of the main transaction",
        "isCorrect": false
      }
    ],
    "explanation": "The trigger compiles, but at run time it fails: a `COMMIT` (or `ROLLBACK`) is not allowed inside an ordinary trigger because the trigger runs within the calling transaction (ORA-04092). The `INSERT` cannot be committed independently of the triggering `UPDATE`.",
    "id": 37,
    "annotations": [
      {
        "n": 1,
        "find": "COMMIT;",
        "note": "Not allowed inside a regular trigger — raises a runtime error (ORA-04092)."
      }
    ],
    "walkthrough": [
      "The trigger compiles successfully.",
      "The `UPDATE` of department 50 affects 20 rows, firing the row trigger 20 times.",
      "Each firing reaches `COMMIT`, which is not allowed inside an ordinary trigger (ORA-04092).",
      "Result: a runtime error — the trigger's work cannot be committed independently of the triggering `UPDATE`."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following command sequence:\nDECLARE\n  i NUMBER;\nBEGIN\n  i := 7;\n  WHILE i < 15 LOOP\n    i := i+3;\n    DBMS_OUTPUT.PUT_LINE('The counter value i is: ' || i);\n  END LOOP;\nEND;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "the sequence will display 10, 13, 16",
        "isCorrect": true
      },
      {
        "text": "the block will run infinitely",
        "isCorrect": false
      },
      {
        "text": "the block will not execute because we cannot use dbms_output.put_line inside a loop",
        "isCorrect": false
      },
      {
        "text": "the sequence will display 7, 10, 13",
        "isCorrect": false
      },
      {
        "text": "the counter increment operation is missing",
        "isCorrect": false
      }
    ],
    "explanation": "Start `i = 7`. Each pass first adds 3 then prints: 7+3=`10`, 10+3=`13`, 13+3=`16` (16 < 15 is false, so the loop stops). It displays 10, 13, 16.",
    "id": 38,
    "annotations": [
      {
        "n": 1,
        "find": "i := i+3",
        "note": "i is increased before each print: 10, 13, 16."
      }
    ],
    "walkthrough": [
      "Start with `i = 7`.",
      "Pass 1: `i := 7+3 = 10`, prints `10`.",
      "Pass 2: `i := 10+3 = 13`, prints `13`.",
      "Pass 3: `i := 13+3 = 16`, prints `16`; now `16 < 15` is false, loop ends.",
      "Output: `10`, `13`, `16`."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following PL/SQL block:\nDECLARE\n  n CONSTANT VARCHAR2(5):=2;\n  a BOOLEAN DEFAULT false;\nBEGIN\n  IF n BETWEEN -1 AND 1 OR a THEN DBMS_OUTPUT.PUT_LINE('A');\n  ELSIF n IS NOT NULL AND NOT a THEN DBMS_OUTPUT.PUT_LINE('B');\n  ELSE\n    DBMS_OUTPUT.PUT_LINE('C');\n  END IF;\nEND;\n/\nThe PL/SQL block displays:",
    "answers": [
      {
        "text": "C",
        "isCorrect": false
      },
      {
        "text": "A",
        "isCorrect": false
      },
      {
        "text": "an error message because the constant is not used correctly",
        "isCorrect": false
      },
      {
        "text": "B",
        "isCorrect": true
      },
      {
        "text": "an error message because the boolean variable is not defined correctly",
        "isCorrect": false
      }
    ],
    "explanation": "`n` is `'2'` (a string constant). `'2' BETWEEN -1 AND 1` is FALSE and `a` is FALSE, so the first branch fails. The `ELSIF n IS NOT NULL AND NOT a` is TRUE (`n` is not null and `a` is false), so it prints `B`.",
    "id": 39,
    "annotations": [
      {
        "n": 1,
        "find": "ELSIF n IS NOT NULL AND NOT a THEN",
        "note": "n is not null and a is FALSE, so this branch runs and prints B."
      }
    ],
    "walkthrough": [
      "`n` is the string constant `'2'`; `a` is `FALSE`.",
      "First branch: `'2' BETWEEN -1 AND 1` is `FALSE` and `a` is `FALSE`, so it is not taken.",
      "`ELSIF n IS NOT NULL AND NOT a`: `n` is not null and `NOT a` is `TRUE`, so this branch runs.",
      "Output: `B`."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "For user-defined exceptions it is mandatory:",
    "answers": [
      {
        "text": "that they be handled in the executable section",
        "isCorrect": false
      },
      {
        "text": "that they be assigned an error code",
        "isCorrect": false
      },
      {
        "text": "that they be declared",
        "isCorrect": true
      },
      {
        "text": "that they be propagated to the calling environment",
        "isCorrect": false
      },
      {
        "text": "that they be invoked by the user",
        "isCorrect": true
      }
    ],
    "explanation": "A user-defined exception must be declared (in the declarative section) and explicitly raised/invoked (with `RAISE`). It is not required to give it an error code, nor to handle or propagate it.",
    "id": 40
  },
  {
    "source": "exam",
    "type": "code",
    "question": "What will be the effect of the following block if no row exists for employee_id = 1000?\nSET SERVEROUTPUT ON\nBEGIN\n  UPDATE employees\n     SET salary = salary + 100\n   WHERE employee_id = 1000;\n  DBMS_OUTPUT.PUT_LINE(SQL%ROWCOUNT);\nEND;",
    "answers": [
      {
        "text": "Displays nothing and continues execution without errors.",
        "isCorrect": false
      },
      {
        "text": "Displays NULL because no rows are affected.",
        "isCorrect": false
      },
      {
        "text": "Displays 0 and the block ends normally.",
        "isCorrect": true
      },
      {
        "text": "Raises the predefined NO_DATA_FOUND exception.",
        "isCorrect": false
      },
      {
        "text": "Raises the TOO_MANY_ROWS exception.",
        "isCorrect": false
      }
    ],
    "explanation": "An `UPDATE` that matches no row is not an error: it simply affects 0 rows. `SQL%ROWCOUNT` is `0` (a real number, not `NULL`), and the block ends normally — no `NO_DATA_FOUND` (that only comes from `SELECT ... INTO`).",
    "id": 41,
    "annotations": [
      {
        "n": 1,
        "find": "DBMS_OUTPUT.PUT_LINE(SQL%ROWCOUNT)",
        "note": "No row matched, so SQL%ROWCOUNT is 0; no exception is raised."
      }
    ],
    "walkthrough": [
      "No employee has `employee_id = 1000`, so the `UPDATE` matches no rows.",
      "Matching no rows is not an error — `SELECT INTO` raises `NO_DATA_FOUND`, but `UPDATE` does not.",
      "`SQL%ROWCOUNT` is `0` (a real number, not `NULL`).",
      "Output: `0`, and the block ends normally."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which combination is valid regarding the existence of specification and/or body?",
    "answers": [
      {
        "text": "Package with body but without specification - only for private local procedures.",
        "isCorrect": false
      },
      {
        "text": "If the specification is missing, the body automatically becomes public.",
        "isCorrect": false
      },
      {
        "text": "If the specification is missing, the body will not compile.",
        "isCorrect": true
      },
      {
        "text": "Package with only specification (no body) - possible when no implementation is needed; package with only body - allowed, but objects remain private.",
        "isCorrect": false
      },
      {
        "text": "Both parts are always mandatory.",
        "isCorrect": false
      }
    ],
    "explanation": "A package specification can exist without a body (when it only declares constants/variables/cursors and no implementation is needed), but a body cannot exist without a specification — without a spec the body will not compile.",
    "id": 42
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Select the true statement about a VARRAY:",
    "answers": [
      {
        "text": "It is always a sparse collection.",
        "isCorrect": false
      },
      {
        "text": "It can contain a variable number of elements, but does not exceed a maximum size fixed at definition.",
        "isCorrect": true
      },
      {
        "text": "DELETE[n] can remove a single element",
        "isCorrect": false
      },
      {
        "text": "The index can have negative values.",
        "isCorrect": false
      },
      {
        "text": "It cannot be passed as a parameter to a subprogram.",
        "isCorrect": false
      }
    ],
    "explanation": "A `VARRAY` holds a variable number of elements up to a maximum size fixed when it is defined. It is always dense (never sparse), is indexed from 1 (no negative indexes), supports `TRIM`/`EXTEND` rather than `DELETE(n)` of a single middle element, and can be passed as a parameter.",
    "id": 43
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Using the FORALL clause instead of a classic FOR loop is recommended for:",
    "answers": [
      {
        "text": "Improving code readability.",
        "isCorrect": false
      },
      {
        "text": "Enabling asynchronous commit.",
        "isCorrect": false
      },
      {
        "text": "Explicit support for VARRAY type collections.",
        "isCorrect": false
      },
      {
        "text": "Reducing the number of context switches between the PL/SQL engine and the SQL engine.",
        "isCorrect": true
      },
      {
        "text": "Allowing the use of GOTO inside DML statements.",
        "isCorrect": false
      }
    ],
    "explanation": "`FORALL` sends all the DML iterations to the SQL engine in one call, dramatically reducing the number of context switches between the PL/SQL engine and the SQL engine — that is its whole purpose.",
    "id": 44
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "A trigger that does not contain the FOR EACH ROW clause executes:",
    "answers": [
      {
        "text": "Once for the DML statement, regardless of the number of affected rows.",
        "isCorrect": true
      },
      {
        "text": "Only if the statement affects at least one row.",
        "isCorrect": false
      },
      {
        "text": "Twice (before and after) for each row.",
        "isCorrect": false
      },
      {
        "text": "Only on COMMIT command.",
        "isCorrect": false
      },
      {
        "text": "Once for each modified row.",
        "isCorrect": false
      }
    ],
    "explanation": "A statement-level trigger (no `FOR EACH ROW`) fires once per triggering DML statement, regardless of how many rows the statement affects (even zero). A row-level trigger fires once per affected row.",
    "id": 45
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "A \"context switch\" occurs when:",
    "answers": [
      {
        "text": "The DBMS_OUTPUT.PUT_LINE procedure is called",
        "isCorrect": false
      },
      {
        "text": "The TRIM method is used on a collection",
        "isCorrect": false
      },
      {
        "text": "Entering an IF ... THEN branch",
        "isCorrect": false
      },
      {
        "text": "An unexpected exception is raised",
        "isCorrect": false
      },
      {
        "text": "The PL/SQL engine executes an SQL statement and transfers it to the SQL engine",
        "isCorrect": true
      }
    ],
    "explanation": "A context switch happens when the PL/SQL engine hands an embedded SQL statement over to the SQL engine (and back). It is not caused by `IF` branches, `DBMS_OUTPUT`, collection methods, or exceptions by themselves.",
    "id": 46
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "The FIRST and LAST methods on a collection return:",
    "answers": [
      {
        "text": "The maximum declared size.",
        "isCorrect": false
      },
      {
        "text": "The values of the first and last elements.",
        "isCorrect": false
      },
      {
        "text": "The total number of elements.",
        "isCorrect": false
      },
      {
        "text": "A boolean value indicating whether the list is empty.",
        "isCorrect": false
      },
      {
        "text": "The first and last defined index in the collection.",
        "isCorrect": true
      }
    ],
    "explanation": "For a collection, `FIRST` and `LAST` return the first and last *index* (subscript) that is defined — not the element values, not the count, and not the declared maximum size.",
    "id": 47
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following command sequence:\nSET SERVEROUTPUT ON\nBEGIN\n  UPDATE ORDER_PRODUCTS SET order_date=order_date-1 WHERE sysdate!=sysdate;\n  DBMS_OUTPUT.PUT_LINE(SQL%ROWCOUNT);\n  ROLLBACK;\nEXCEPTION\n  WHEN OTHERS THEN DBMS_OUTPUT.PUT_LINE('Error');\nEND;\nAssume the ORDER_PRODUCTS table exists and has 105 rows. Under these conditions, the PL/SQL block displays:",
    "answers": [
      {
        "text": "A value between 1 and 105",
        "isCorrect": false
      },
      {
        "text": "Error",
        "isCorrect": false
      },
      {
        "text": "0",
        "isCorrect": true
      },
      {
        "text": "NULL",
        "isCorrect": false
      },
      {
        "text": "105",
        "isCorrect": false
      }
    ],
    "explanation": "`WHERE sysdate != sysdate` is never TRUE, so the `UPDATE` matches no rows and `SQL%ROWCOUNT` is `0`. No exception occurs, so the `WHEN OTHERS` handler does not run and \"Error\" is not shown.",
    "id": 48,
    "annotations": [
      {
        "n": 1,
        "find": "WHERE sysdate!=sysdate",
        "note": "Always false, so the UPDATE affects 0 rows; SQL%ROWCOUNT = 0."
      }
    ],
    "walkthrough": [
      "`WHERE sysdate != sysdate` is never true, so the `UPDATE` matches no rows.",
      "`SQL%ROWCOUNT` is `0`.",
      "No exception occurs, so the `WHEN OTHERS` handler (which prints `Error`) never runs.",
      "Output: `0`."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the block below. The table exists, has the referenced columns and at least 10 rows.\nDECLARE\n  V_LASTNAME VARCHAR2(100);\n  V_FIRSTNAME EMPLOYEES.FIRST_NAME%TYPE;\n  I NUMBER(3) DEFAULT 100;\nBEGIN\n  I:=1000;\n  SELECT LAST_NAME,FIRST_NAME INTO V_LASTNAME,V_FIRSTNAME FROM EMPLOYEES WHERE EMPLOYEE_ID=I;\n  DBMS_OUTPUT.PUT_LINE('Employee '||I||' is '||V_LASTNAME||' '||V_FIRSTNAME);\n  I:=I+1;\nEXCEPTION\n  WHEN NO_DATA_FOUND THEN DBMS_OUTPUT.PUT_LINE('NO SUCH EMPLOYEE '||I);\n  WHEN TOO_MANY_ROWS THEN DBMS_OUTPUT.PUT_LINE('THE SELECT RETURNED MORE THAN 1 ROW');\n  WHEN OTHERS THEN\n    DBMS_OUTPUT.PUT_LINE('ANOTHER EXCEPTION OCCURRED');\n    BEGIN\n      I:=I/0;\n    EXCEPTION\n      WHEN ZERO_DIVIDE THEN DBMS_OUTPUT.PUT_LINE('WE CANNOT DIVIDE BY ZERO');\n    END;\nEND;",
    "answers": [
      {
        "text": "NO SUCH EMPLOYEE 1000",
        "isCorrect": false
      },
      {
        "text": "It depends on the data in the EMPLOYEES table",
        "isCorrect": false
      },
      {
        "text": "ANOTHER EXCEPTION OCCURRED / WE CANNOT DIVIDE BY ZERO",
        "isCorrect": true
      },
      {
        "text": "The block runs but displays nothing",
        "isCorrect": false
      },
      {
        "text": "The block does not compile",
        "isCorrect": false
      }
    ],
    "explanation": "`I` is `NUMBER(3)`, whose maximum is 999, so `I := 1000` raises `VALUE_ERROR` before the `SELECT`. `VALUE_ERROR` is neither `NO_DATA_FOUND` nor `TOO_MANY_ROWS`, so `WHEN OTHERS` runs and prints \"ANOTHER EXCEPTION OCCURRED\"; inside it, `I := I/0` raises `ZERO_DIVIDE`, caught by the inner handler printing \"WE CANNOT DIVIDE BY ZERO\".",
    "id": 49,
    "annotations": [
      {
        "n": 1,
        "find": "I:=1000",
        "note": "I is NUMBER(3) (max 999), so assigning 1000 raises VALUE_ERROR."
      },
      {
        "n": 2,
        "find": "I:=I/0",
        "note": "In the OTHERS handler, division by zero raises ZERO_DIVIDE."
      }
    ],
    "walkthrough": [
      "`I` is `NUMBER(3)` (max 999), so `I := 1000` raises `VALUE_ERROR` before the `SELECT`.",
      "`VALUE_ERROR` is neither `NO_DATA_FOUND` nor `TOO_MANY_ROWS`, so `WHEN OTHERS` runs and prints `ANOTHER EXCEPTION OCCURRED`.",
      "Inside that handler, `I := I/0` raises `ZERO_DIVIDE`.",
      "The inner handler catches it and prints `WE CANNOT DIVIDE BY ZERO`.",
      "Output: `ANOTHER EXCEPTION OCCURRED` then `WE CANNOT DIVIDE BY ZERO`."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the trigger below. The tables exist, have the referenced columns and at least 10 rows each.\nCREATE OR REPLACE TRIGGER CHECK_SAL_REP\nAFTER UPDATE OF SALARY ON EMPLOYEES FOR EACH ROW\nWHEN (NEW.SALARY>OLD.SALARY AND NEW.JOB_ID='SA_REP')\nDECLARE\n  N NUMBER;\nBEGIN\n  SELECT COUNT(*) INTO N FROM ORDERS WHERE EMPLOYEE_ID=:OLD.EMPLOYEE_ID;\n  IF N=0 THEN :NEW.SALARY:=:OLD.SALARY; END IF;\nEND;\nWhich of the following statements is true?",
    "answers": [
      {
        "text": "The trigger does not compile successfully",
        "isCorrect": true
      },
      {
        "text": "The trigger fires once, regardless of how many rows are modified",
        "isCorrect": false
      },
      {
        "text": "The trigger compiles but always raises an exception",
        "isCorrect": false
      },
      {
        "text": "This type of trigger must contain a commit or rollback in the executable part",
        "isCorrect": false
      }
    ],
    "explanation": "This is an `AFTER UPDATE` row trigger, and inside it the line `:NEW.SALARY := :OLD.SALARY` tries to modify `:NEW`. You can only assign to `:NEW` in a `BEFORE` trigger; doing it in an `AFTER` trigger is illegal, so the trigger does not compile.",
    "id": 50,
    "annotations": [
      {
        "n": 1,
        "find": "AFTER UPDATE OF SALARY ON EMPLOYEES FOR EACH ROW",
        "note": "AFTER trigger: :NEW is read-only here."
      },
      {
        "n": 2,
        "find": ":NEW.SALARY:=:OLD.SALARY",
        "note": "Assigning to :NEW is only allowed in a BEFORE trigger — compile error."
      }
    ],
    "walkthrough": [
      "This is an `AFTER UPDATE ... FOR EACH ROW` trigger.",
      "Its body does `:NEW.SALARY := :OLD.SALARY`, assigning to `:NEW`.",
      "You may only assign to `:NEW` in a `BEFORE` row trigger; in an `AFTER` trigger the row is already written.",
      "Result: the trigger does not compile."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following PL/SQL block:\nSET SERVEROUTPUT ON\nDECLARE\n  v_grade PLS_INTEGER:=3;\nBEGIN\n  CASE\n    WHEN v_grade BETWEEN 5 AND 10 THEN dbms_output.put_line('Passed'); dbms_output.put_line('Congratulations');\n    WHEN v_grade IS NULL THEN dbms_output.put_line('No grade');\n    WHEN v_grade<1 OR v_grade>10 THEN dbms_output.put_line('Invalid grade');\n  END CASE;\n  dbms_output.put_line('Failed');\nEND;\nWhat happens at runtime?",
    "answers": [
      {
        "text": "The block does not compile",
        "isCorrect": false
      },
      {
        "text": "The block runs successfully but displays nothing",
        "isCorrect": false
      },
      {
        "text": "An exception is raised at runtime",
        "isCorrect": true
      },
      {
        "text": "At runtime it displays 'Failed'",
        "isCorrect": false
      },
      {
        "text": "The block uses an implicit cursor",
        "isCorrect": false
      }
    ],
    "explanation": "This is a searched `CASE` statement with no `ELSE`. `v_grade` is 3, which matches none of the `WHEN` conditions (not 5..10, not NULL, not <1 or >10). A `CASE` statement with no matching branch and no `ELSE` raises the predefined `CASE_NOT_FOUND` (ORA-06592) exception at run time.",
    "id": 51,
    "annotations": [
      {
        "n": 1,
        "find": "END CASE;",
        "note": "No WHEN matched and there is no ELSE, so CASE_NOT_FOUND is raised here."
      }
    ],
    "walkthrough": [
      "This is a searched `CASE` statement with no `ELSE`.",
      "`v_grade` is `3`: not between `5` and `10`, not `NULL`, and not `<1 or >10`.",
      "No `WHEN` matches and there is no `ELSE`, so `CASE_NOT_FOUND` (ORA-06592) is raised.",
      "Result: an exception is raised at runtime (the `Failed` line is never reached)."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following command sequence:\nCREATE OR REPLACE PROCEDURE check_sysdate IS\nBEGIN\n  dbms_output.put_line(SYSDATE+2/48);\nEND;\n/\nSET SERVEROUTPUT ON\nBEGIN\n  check_sysdate;\nEND;\nWhich statement is correct?",
    "answers": [
      {
        "text": "An empty string is displayed",
        "isCorrect": false
      },
      {
        "text": "The block does not compile",
        "isCorrect": false
      },
      {
        "text": "A calendar date is displayed",
        "isCorrect": true
      },
      {
        "text": "A numeric value is displayed",
        "isCorrect": false
      },
      {
        "text": "The block runs but raises an exception",
        "isCorrect": false
      }
    ],
    "explanation": "`SYSDATE + 2/48` adds a fraction of a day (2 of 48 half-hours = 1 hour) to the current date, giving a `DATE` value, so the procedure displays a calendar date/time. The procedure compiles and runs fine.",
    "id": 52,
    "annotations": [
      {
        "n": 1,
        "find": "SYSDATE+2/48",
        "note": "Date plus a day-fraction is still a DATE, so a date is printed."
      }
    ],
    "walkthrough": [
      "`2/48` of a day equals one hour.",
      "`SYSDATE + 2/48` is a `DATE` value (date + time), not a number.",
      "`DBMS_OUTPUT.PUT_LINE` displays that date/time.",
      "Result: a calendar date is displayed."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "What is a user-defined exception in PL/SQL?",
    "answers": [
      {
        "text": "It is an exception raised by the user using the RAISE statement.",
        "isCorrect": true
      },
      {
        "text": "It is an exception that cannot be caught or handled in the PL/SQL block.",
        "isCorrect": false
      },
      {
        "text": "It is an exception that occurs when a user tries to access a stored procedure that does not exist.",
        "isCorrect": false
      },
      {
        "text": "It is an exception that occurs only when the user tries to connect to the database.",
        "isCorrect": false
      },
      {
        "text": "It is a system-defined exception that is caught and handled by the user.",
        "isCorrect": false
      }
    ],
    "explanation": "A user-defined exception is one you declare yourself and raise with the `RAISE` statement (or `RAISE_APPLICATION_ERROR`). It can be caught and handled like any exception; it is not a system or connection error.",
    "id": 53
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "The PL/SQL language:",
    "answers": [
      {
        "text": "is a universal programming language",
        "isCorrect": false
      },
      {
        "text": "is a data description language",
        "isCorrect": false
      },
      {
        "text": "is a modeling language",
        "isCorrect": false
      },
      {
        "text": "is an exception-handling language",
        "isCorrect": false
      },
      {
        "text": "is a procedural programming language",
        "isCorrect": true
      }
    ],
    "explanation": "PL/SQL is a procedural programming language (a procedural extension of SQL). It is not a general-purpose/universal language, nor purely a data-description, modeling, or exception-handling language.",
    "id": 54
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following command sequence:\ni := 2;\nWHILE i<3 LOOP\n  i := 4;\n  dbms_output.put_line('The counter value is: ' || i);\nEND LOOP;\nHow many result lines will be displayed:",
    "answers": [
      {
        "text": "one",
        "isCorrect": true
      },
      {
        "text": "two",
        "isCorrect": false
      },
      {
        "text": "the block will run infinitely",
        "isCorrect": false
      },
      {
        "text": "the block will not execute because we cannot use dbms_output.put_line inside a loop",
        "isCorrect": false
      },
      {
        "text": "none",
        "isCorrect": false
      }
    ],
    "explanation": "Start `i = 2`. The `WHILE i < 3` test passes once; inside, `i := 4` and one line is printed. On the next test `4 < 3` is false, so the loop ends after a single line.",
    "id": 55,
    "annotations": [
      {
        "n": 1,
        "find": "i := 4",
        "note": "i jumps to 4, so the next WHILE test (4<3) fails — only one line prints."
      }
    ],
    "walkthrough": [
      "Start with `i = 2`; `WHILE i < 3` is true, so the body runs once.",
      "Inside, `i := 4` and one line is printed.",
      "Next test: `4 < 3` is false, so the loop ends.",
      "Result: exactly one line is displayed."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Can OUT-type parameters defined in a procedure be given default values?",
    "answers": [
      {
        "text": "True",
        "isCorrect": false
      },
      {
        "text": "False",
        "isCorrect": true
      }
    ],
    "explanation": "False. Only `IN` parameters may have default values. `OUT` (and `IN OUT`) parameters cannot be given defaults.",
    "id": 56
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following conventions for passing formal and actual parameters of a subprogram are valid in PL/SQL:",
    "answers": [
      {
        "text": "there must be the same number of parameters",
        "isCorrect": true
      },
      {
        "text": "the parameters do not need to be in the same order",
        "isCorrect": false
      },
      {
        "text": "the parameters must be in the same order",
        "isCorrect": true
      },
      {
        "text": "the type for each corresponding parameter must be different",
        "isCorrect": false
      },
      {
        "text": "the names of the parameters in the two categories cannot be different",
        "isCorrect": false
      }
    ],
    "explanation": "With positional association, the actual and formal parameters must match in number and be given in the same order. Their names may differ, and corresponding parameters must be type-compatible (not of different types).",
    "id": 57
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Can packages be defined that include only the specification part?",
    "answers": [
      {
        "text": "True",
        "isCorrect": true
      },
      {
        "text": "False",
        "isCorrect": false
      }
    ],
    "explanation": "True. A package can consist of just a specification (for example, one that only declares constants, variables, types or cursors), with no body.",
    "id": 58
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Can the package body be changed without modifying its specification?",
    "answers": [
      {
        "text": "True",
        "isCorrect": true
      },
      {
        "text": "False",
        "isCorrect": false
      }
    ],
    "explanation": "True. As long as the specification (the public interface) stays the same, you can recompile the package body alone — that is exactly why the spec/body split exists.",
    "id": 59
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Can functions be defined with the same name as predefined ones?",
    "answers": [
      {
        "text": "True",
        "isCorrect": true
      },
      {
        "text": "False",
        "isCorrect": false
      }
    ],
    "explanation": "True. You can define your own function with the same name as a built-in; within your schema/package your version is used (and overloading by parameter list is allowed).",
    "id": 60
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Can a procedure be declared in the specification but not implemented in the package body? And the other way around?",
    "answers": [
      {
        "text": "True, True",
        "isCorrect": false
      },
      {
        "text": "True, False",
        "isCorrect": false
      },
      {
        "text": "False, True",
        "isCorrect": true
      },
      {
        "text": "False, False",
        "isCorrect": false
      }
    ],
    "explanation": "Declaring a subprogram in the specification but never implementing it in the body is an error (the body will not compile) — so that direction is False. The reverse is fine: a subprogram defined only in the body (not in the spec) is simply a private subprogram — so that direction is True.",
    "id": 61
  },
  {
    "source": "exam",
    "type": "code",
    "question": "What will the PL/SQL block display?\nBEGIN\n  IF sql%found THEN dbms_output.put_line(0);\n  ELSE dbms_output.put_line(1);\n  END IF;\nEND;",
    "answers": [
      {
        "text": "0",
        "isCorrect": false
      },
      {
        "text": "1",
        "isCorrect": true
      },
      {
        "text": "it will raise a compilation error",
        "isCorrect": false
      },
      {
        "text": "it will return an exception",
        "isCorrect": false
      },
      {
        "text": "NULL",
        "isCorrect": false
      }
    ],
    "explanation": "No DML statement has run in this block, so the implicit-cursor attribute `SQL%FOUND` is `NULL`. `IF NULL` is not TRUE, so control falls to the `ELSE` and prints `1`.",
    "id": 62,
    "annotations": [
      {
        "n": 1,
        "find": "IF sql%found THEN",
        "note": "No prior DML, so SQL%FOUND is NULL → not TRUE → ELSE runs."
      }
    ],
    "walkthrough": [
      "No DML statement has run in this block.",
      "With no prior SQL statement, `SQL%FOUND` is `NULL`.",
      "`IF NULL` is not `TRUE`, so control falls to the `ELSE`.",
      "Output: `1`."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Consider the PL/SQL function, successfully created, with the following header: FUNCTION show_salary (p_id employees.employee_id%TYPE) RETURN NUMBER. Which of the following call variants are correct:",
    "answers": [
      {
        "text": "EXECUTE DBMS_OUTPUT.PUT_LINE(show_salary(100))",
        "isCorrect": true
      },
      {
        "text": "EXECUTE show_salary(100)",
        "isCorrect": false
      },
      {
        "text": "DECLARE v_sal employees.salary%TYPE; BEGIN v_sal := show_salary(100); DBMS_OUTPUT.PUT_LINE('The salary is: '||v_sal); END;",
        "isCorrect": true
      },
      {
        "text": "SELECT job_id, show_salary(employee_id) AS sal FROM employees;",
        "isCorrect": true
      },
      {
        "text": "CALL show_salary(100)",
        "isCorrect": false
      }
    ],
    "explanation": "A function returns a value, so it must be called where a value is expected: inside `DBMS_OUTPUT.PUT_LINE(...)` via `EXECUTE`, assigned to a variable in a block, or used in a `SELECT`. `EXECUTE show_salary(100)` and `CALL show_salary(100)` are invalid because there is nowhere to put the returned value (`CALL` would need an `INTO` host variable).",
    "id": 63
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "The functions of a DBMS are: A. program definition B. data description C. program manipulation D. data administration E. use of the information system",
    "answers": [
      {
        "text": "A + C + E",
        "isCorrect": false
      },
      {
        "text": "B + D",
        "isCorrect": true
      },
      {
        "text": "A + B + C + D + E",
        "isCorrect": false
      },
      {
        "text": "B + C + E",
        "isCorrect": false
      },
      {
        "text": "A + B",
        "isCorrect": false
      }
    ],
    "explanation": "The functions of a DBMS are data description and data administration (B + D). \"Program definition\", \"program manipulation\" and \"use of the information system\" are not DBMS functions.",
    "id": 64
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the PL/SQL block:\nCREATE OR REPLACE PROCEDURE avg_sal (p_avg_sal OUT NUMBER) IS\nBEGIN\n  SELECT AVG(salary) INTO p_avg_sal FROM employees;\nEND;\n/\nWhich of the following groupings of statements are correct: A. a subprogram is created B. the procedure receives an output parameter C. a group function is used in the commands of the procedure body D. an error is generated because the RETURN command is missing E. an error is generated because the SELECT command has an incorrect structure",
    "answers": [
      {
        "text": "D",
        "isCorrect": false
      },
      {
        "text": "A + B + C + D + E",
        "isCorrect": false
      },
      {
        "text": "A + B + E",
        "isCorrect": false
      },
      {
        "text": "E",
        "isCorrect": false
      },
      {
        "text": "A + B + C",
        "isCorrect": true
      }
    ],
    "explanation": "A + B + C: it creates a subprogram (a procedure), the procedure receives an `OUT` parameter, and its body uses the group function `AVG`. There is no error — a procedure needs no `RETURN`, and the `SELECT ... INTO` is well formed.",
    "id": 65,
    "annotations": [
      {
        "n": 1,
        "find": "p_avg_sal OUT NUMBER",
        "note": "An `OUT` parameter — the procedure can write to it, which is what lets the `SELECT INTO` succeed."
      },
      {
        "n": 2,
        "find": "AVG(salary)",
        "note": "A group (aggregate) function, used here inside a SQL statement in the procedure body."
      },
      {
        "n": 3,
        "find": "INTO p_avg_sal",
        "note": "Valid single-row `SELECT INTO`; a procedure needs no `RETURN` to give back a value."
      }
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "The %TYPE attribute:",
    "answers": [
      {
        "text": "It is an attribute used only to specify the data type of subprogram parameters",
        "isCorrect": false
      },
      {
        "text": "It allows us to take the type of an exception",
        "isCorrect": false
      },
      {
        "text": "None of the listed options",
        "isCorrect": false
      },
      {
        "text": "It specifies the data type of a variable when we declare it",
        "isCorrect": true
      },
      {
        "text": "It allows us to take the data type of a record",
        "isCorrect": false
      }
    ],
    "explanation": "`%TYPE` is used in a declaration to give a variable the same data type as an existing column or variable (e.g. `v_sal employees.salary%TYPE`). It anchors the type only — it does not copy a value, and it is not limited to parameters.",
    "id": 66
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following code sequence:\nDECLARE\n  X NUMBER(3);\n  Y NUMBER(3);\nBEGIN\n  X:=100;\n  IF x <> y THEN a('test'); END IF;\nEND;\n/\nWhere a is a procedure for display. What will it display?:",
    "answers": [
      {
        "text": "test",
        "isCorrect": false
      },
      {
        "text": "TRUE",
        "isCorrect": false
      },
      {
        "text": "100",
        "isCorrect": false
      },
      {
        "text": "An error",
        "isCorrect": true
      },
      {
        "text": "It will display nothing",
        "isCorrect": true
      }
    ],
    "explanation": "`Y` is never initialised, so it is `NULL`; `X <> Y` evaluates to `NULL` (not TRUE), so the `THEN` branch is never taken and nothing would print. On top of that, `a` is not declared in the block, so the block actually fails to compile — either way it displays nothing useful.",
    "id": 67,
    "annotations": [
      {
        "n": 1,
        "find": "IF x <> y THEN",
        "note": "Y is NULL, so x<>y is NULL (not TRUE) — the THEN never runs."
      },
      {
        "n": 2,
        "find": "a('test')",
        "note": "a is not declared, so this is a compile error."
      }
    ],
    "walkthrough": [
      "`Y` is never initialised, so it is `NULL`; `X <> Y` evaluates to `NULL`, not `TRUE`, so the `THEN` is not taken.",
      "Also `a` is not declared anywhere in the block.",
      "That undefined reference makes the block fail to compile.",
      "Result: an error — and in any case nothing is displayed."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following blocks are NOT stored in the database?:",
    "answers": [
      {
        "text": "Procedures",
        "isCorrect": false
      },
      {
        "text": "Anonymous blocks",
        "isCorrect": true
      },
      {
        "text": "Packages",
        "isCorrect": false
      },
      {
        "text": "Functions",
        "isCorrect": false
      },
      {
        "text": "Triggers",
        "isCorrect": false
      }
    ],
    "explanation": "Anonymous blocks are not stored in the database — they are compiled and run on the spot. Procedures, functions, packages and triggers are stored (named) objects.",
    "id": 68
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following commands cannot be used without EXECUTE IMMEDIATE in PL/SQL blocks?:",
    "answers": [
      {
        "text": "INSERT",
        "isCorrect": false
      },
      {
        "text": "ROLLBACK",
        "isCorrect": false
      },
      {
        "text": "GRANT",
        "isCorrect": true
      },
      {
        "text": "SELECT",
        "isCorrect": false
      },
      {
        "text": "SAVEPOINT",
        "isCorrect": false
      }
    ],
    "explanation": "`GRANT` is a DCL/DDL command, which cannot run directly in a PL/SQL block — it requires `EXECUTE IMMEDIATE`. `INSERT`, `SELECT`, `ROLLBACK` and `SAVEPOINT` can be used directly.",
    "id": 69
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the code sequence:\nCREATE OR REPLACE PROCEDURE avg_sal (p_avg_sal IN NUMBER) IS\nBEGIN\n  SELECT AVG(salary) INTO p_avg_sal FROM employees;\nEND;\n/\nWhat happens at runtime?:",
    "answers": [
      {
        "text": "None of the listed options",
        "isCorrect": false
      },
      {
        "text": "A procedure with no compilation errors is created that computes the average salary for each department",
        "isCorrect": false
      },
      {
        "text": "An error occurs",
        "isCorrect": true
      },
      {
        "text": "A procedure with no compilation errors is created that computes the average salary",
        "isCorrect": false
      },
      {
        "text": "The procedure avg_sal is created with no compilation errors",
        "isCorrect": false
      }
    ],
    "explanation": "An error occurs: `p_avg_sal` is declared `IN`, which is read-only inside the procedure, so `SELECT AVG(salary) INTO p_avg_sal` cannot assign to it. It would need to be an `OUT` (or `IN OUT`) parameter.",
    "id": 70,
    "annotations": [
      {
        "n": 1,
        "find": "p_avg_sal IN NUMBER",
        "note": "IN parameters are read-only — you cannot SELECT INTO them."
      }
    ],
    "walkthrough": [
      "`p_avg_sal` is declared `IN`, which is read-only inside the procedure.",
      "`SELECT AVG(salary) INTO p_avg_sal` tries to assign to that read-only parameter.",
      "This is illegal, so an error occurs.",
      "Fix: declare the parameter `OUT` (or `IN OUT`)."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following code sequence:\nDECLARE\n  v_rez NUMBER;\nBEGIN\n  v_rez:=sp_nr(2800);\n  dbms_output.put_line(v_rez);\nEND;\n/\nWhat is the role of this sequence?",
    "answers": [
      {
        "text": "It calls a function sp_nr inside a block",
        "isCorrect": true
      },
      {
        "text": "It calls a procedure sp_nr inside a block",
        "isCorrect": false
      },
      {
        "text": "It fires a trigger",
        "isCorrect": false
      },
      {
        "text": "An error occurs because the syntax is incorrect",
        "isCorrect": false
      },
      {
        "text": "It raises an exception",
        "isCorrect": false
      }
    ],
    "explanation": "`v_rez := sp_nr(2800)` assigns the result of `sp_nr(2800)` to a variable, so `sp_nr` must be a *function* (it returns a value). A procedure could not be used on the right-hand side of an assignment.",
    "id": 71,
    "annotations": [
      {
        "n": 1,
        "find": "v_rez:=sp_nr(2800)",
        "note": "Used on the right of := , so sp_nr returns a value — it is a function."
      }
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following code sequence:\nDECLARE\n  x NUMBER(8);\nBEGIN\n  SELECT sum(salary) INTO x FROM employees WHERE department_id = 1500;\nEND;\n/\nGiven that the department with id 1500 does not exist, what happens at runtime?",
    "answers": [
      {
        "text": "The value of x will be 1500",
        "isCorrect": false
      },
      {
        "text": "The value of x will be null",
        "isCorrect": true
      },
      {
        "text": "An error occurs",
        "isCorrect": false
      },
      {
        "text": "The NO_DATA_FOUND exception is raised",
        "isCorrect": false
      },
      {
        "text": "The value of x will be 0",
        "isCorrect": false
      }
    ],
    "explanation": "A group function like `SUM` always returns exactly one row, even when no underlying rows match — in that case it returns `NULL`. So `x` becomes `NULL` and no `NO_DATA_FOUND` is raised.",
    "id": 72,
    "annotations": [
      {
        "n": 1,
        "find": "SELECT sum(salary) INTO x FROM employees WHERE department_id = 1500",
        "note": "SUM over zero rows returns one row holding NULL — no NO_DATA_FOUND."
      }
    ],
    "walkthrough": [
      "Department `1500` does not exist, so no employee rows match.",
      "But `SUM(salary)` is a group function — it always returns exactly one row.",
      "With no matching rows that single row is `NULL`, so no `NO_DATA_FOUND` is raised.",
      "Result: `x` is `NULL`."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "What is the purpose of labeling blocks?",
    "answers": [
      {
        "text": "It allows prefixing a variable so it can be used",
        "isCorrect": true
      },
      {
        "text": "It associates a name with the block so it is stored in the database",
        "isCorrect": false
      },
      {
        "text": "It is mandatory when we have nested blocks",
        "isCorrect": false
      },
      {
        "text": "It allows the use of directives",
        "isCorrect": false
      },
      {
        "text": "Labeling blocks is not possible",
        "isCorrect": false
      }
    ],
    "explanation": "A block label lets you qualify (prefix) names with the block label, so you can reach a variable that would otherwise be hidden by an inner declaration (e.g. `outer_block.v`). It does not store the block in the database and is not mandatory for nesting.",
    "id": 73
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Triggers:",
    "answers": [
      {
        "text": "Are used only for physical tables",
        "isCorrect": false
      },
      {
        "text": "None of the listed options",
        "isCorrect": false
      },
      {
        "text": "Fire when exceptional situations related to the connection occur",
        "isCorrect": false
      },
      {
        "text": "Fire on one or more update operations",
        "isCorrect": true
      },
      {
        "text": "In triggers, DECLARE is never used",
        "isCorrect": false
      }
    ],
    "explanation": "Triggers fire automatically on one or more DML (update) operations on a table/view. They are not limited to physical tables only, are not about connection events, and they can contain a `DECLARE` section.",
    "id": 74
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "When declaring a variable it is necessary to:",
    "answers": [
      {
        "text": "Specify whether it is nullable or not",
        "isCorrect": false
      },
      {
        "text": "Specify the data type",
        "isCorrect": true
      },
      {
        "text": "Specify whether it is a constant or not",
        "isCorrect": false
      },
      {
        "text": "Initialize it",
        "isCorrect": false
      },
      {
        "text": "Give it a default value",
        "isCorrect": false
      }
    ],
    "explanation": "When declaring a variable you must specify its data type. Initialising it, marking it constant, or declaring nullability are optional.",
    "id": 75
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following code sequence:\nDECLARE\n  CURSOR c(p_id NUMBER, p_id1 NUMBER) IS\n    SELECT department_id, last_name, salary FROM employees\n    WHERE department_id = p_id AND salary >= p_id1;\nBEGIN\n  FOR r IN c(20, 2000) LOOP\n    DBMS_OUTPUT.PUT_LINE(r.department_id||' '||r.last_name||' '||r.salary);\n  END LOOP;\n  FOR r IN c(30, 3000) LOOP\n    DBMS_OUTPUT.PUT_LINE(r.department_id||' '||r.last_name||' '||r.salary);\n  END LOOP;\nEND;\n/\nWhat happens when the code runs?",
    "answers": [
      {
        "text": "An error occurs because the cursors should have been nested",
        "isCorrect": false
      },
      {
        "text": "An error occurs because one of the departments does not exist and the error is not handled",
        "isCorrect": false
      },
      {
        "text": "A cursor with 2 parameters is executed twice",
        "isCorrect": true
      },
      {
        "text": "It defines 2 cursors with 2 parameters and runs",
        "isCorrect": false
      },
      {
        "text": "None of the options",
        "isCorrect": false
      }
    ],
    "explanation": "This declares one parameterized cursor `c(p_id, p_id1)` and runs it twice via two cursor `FOR` loops with different arguments — `c(20, 2000)` and `c(30, 3000)`. It is not two cursors and needs no nesting.",
    "id": 76,
    "annotations": [
      {
        "n": 1,
        "find": "CURSOR c(p_id NUMBER, p_id1 NUMBER)",
        "note": "A single cursor with two parameters..."
      },
      {
        "n": 2,
        "find": "FOR r IN c(30, 3000) LOOP",
        "note": "...reused here with different arguments — executed a second time."
      }
    ],
    "walkthrough": [
      "One parameterized cursor `c(p_id, p_id1)` is declared.",
      "The first cursor `FOR` loop opens it with `c(20, 2000)` and lists matching rows.",
      "The second cursor `FOR` loop opens the same cursor with `c(30, 3000)`.",
      "Result: one 2-parameter cursor is executed twice — no nesting and no error."
    ]
  },
  {
    "source": "exam",
    "type": "code",
    "question": "Consider the following code sequence:\nCREATE OR REPLACE TRIGGER generate_product_code\nBEFORE INSERT ON products FOR EACH ROW\nWHEN (new.product_id > 3000)\nBEGIN\n  SELECT seq.nextval INTO :new.product_id FROM dual;\nEND;\n/\nWhat will happen at runtime?",
    "answers": [
      {
        "text": "A trigger is created that will fire",
        "isCorrect": true
      },
      {
        "text": "An error occurs because in WHEN (new.product_id > 3000) new should have had ':'",
        "isCorrect": false
      },
      {
        "text": "None of the listed options",
        "isCorrect": false
      },
      {
        "text": "A trigger is created with compilation errors",
        "isCorrect": false
      },
      {
        "text": "It does not fire because the value of new for product_id is not known yet",
        "isCorrect": false
      }
    ],
    "explanation": "This is a valid `BEFORE INSERT ... FOR EACH ROW` trigger that fills `:new.product_id` from a sequence. Inside the `WHEN` clause you reference `new` *without* a colon (`WHEN (new.product_id > 3000)`), which is correct, so the trigger is created and will fire.",
    "id": 77,
    "annotations": [
      {
        "n": 1,
        "find": "WHEN (new.product_id > 3000)",
        "note": "Inside WHEN you use new without a colon — this is correct."
      }
    ],
    "walkthrough": [
      "`BEFORE INSERT ... FOR EACH ROW` lets the trigger set `:new` before the row is stored.",
      "Inside the `WHEN` clause, `new` is written without a colon — `WHEN (new.product_id > 3000)` — which is correct.",
      "The body fills `:new.product_id` from `seq.nextval`.",
      "Result: the trigger is created successfully and will fire."
    ]
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following methods cannot be used on an INDEX BY TABLE variable?",
    "answers": [
      {
        "text": "PREVIOUS",
        "isCorrect": true
      },
      {
        "text": "FIRST",
        "isCorrect": false
      },
      {
        "text": "DELETE",
        "isCorrect": false
      },
      {
        "text": "ROWCOUNT",
        "isCorrect": true
      },
      {
        "text": "EXISTS",
        "isCorrect": false
      }
    ],
    "explanation": "On an INDEX BY (associative array) you can use `FIRST`, `DELETE`, `EXISTS`, etc. `PREVIOUS` is not a valid method name (the method is `PRIOR`), and `ROWCOUNT` is a *cursor* attribute, not a collection method — so neither can be used.",
    "id": 78
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "Which of the following sections is mandatory?",
    "answers": [
      {
        "text": "BEGIN",
        "isCorrect": true
      },
      {
        "text": "EXECUTE",
        "isCorrect": false
      },
      {
        "text": "EXCEPTION",
        "isCorrect": false
      },
      {
        "text": "EXECUTE IMMEDIATE",
        "isCorrect": false
      },
      {
        "text": "DECLARE",
        "isCorrect": false
      }
    ],
    "explanation": "The executable section, `BEGIN ... END`, is the only mandatory part of a PL/SQL block. `DECLARE` and `EXCEPTION` are optional, and `EXECUTE`/`EXECUTE IMMEDIATE` are not block sections.",
    "id": 79
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "For non-predefined exceptions:",
    "answers": [
      {
        "text": "it is mandatory that they be propagated to the calling environment",
        "isCorrect": false
      },
      {
        "text": "they must be assigned an error code defined by the DBMS",
        "isCorrect": false
      },
      {
        "text": "it is necessary that they be declared",
        "isCorrect": true
      },
      {
        "text": "it is necessary that they be assigned a user-defined error code",
        "isCorrect": false
      },
      {
        "text": "it is necessary that they be handled",
        "isCorrect": false
      }
    ],
    "explanation": "A non-predefined (user-defined) exception must be declared. It does not have to be handled or propagated, and you are not required to assign it a custom error code.",
    "id": 80
  },
  {
    "source": "exam",
    "type": "theory",
    "question": "%ROWTYPE",
    "answers": [
      {
        "text": "It is used only when defining subprogram parameters",
        "isCorrect": false
      },
      {
        "text": "None of the listed options",
        "isCorrect": false
      },
      {
        "text": "It is a record-type attribute that allows defining a variable according to the programmer's needs",
        "isCorrect": false
      },
      {
        "text": "It specifies the data type of a record",
        "isCorrect": false
      },
      {
        "text": "It is a record-type attribute that allows defining a variable of the same type as a row from a table or a cursor",
        "isCorrect": true
      }
    ],
    "explanation": "`%ROWTYPE` defines a record variable with the same structure (field names, types and order) as a row of a table or the result of a cursor — e.g. `emp_rec employees%ROWTYPE`.",
    "id": 81
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "In a PL/SQL block, which section is mandatory?",
    "answers": [
      {
        "text": "The DECLARE section.",
        "isCorrect": false
      },
      {
        "text": "The executable section (BEGIN ... END).",
        "isCorrect": true
      },
      {
        "text": "The EXCEPTION section.",
        "isCorrect": false
      },
      {
        "text": "All three sections are mandatory.",
        "isCorrect": false
      }
    ],
    "explanation": "The executable section (`BEGIN ... END`) is the only mandatory section. `DECLARE` and `EXCEPTION` are optional.",
    "id": 82
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Which of the following commands CANNOT be used directly inside a PL/SQL block (without EXECUTE IMMEDIATE)?",
    "answers": [
      {
        "text": "CREATE TABLE",
        "isCorrect": true
      },
      {
        "text": "ALTER TABLE",
        "isCorrect": true
      },
      {
        "text": "GRANT",
        "isCorrect": true
      },
      {
        "text": "UPDATE",
        "isCorrect": false
      },
      {
        "text": "COMMIT",
        "isCorrect": false
      }
    ],
    "explanation": "DDL such as `CREATE TABLE` and `ALTER TABLE`, and DCL such as `GRANT`, cannot be written directly in a PL/SQL block — they require `EXECUTE IMMEDIATE`. `UPDATE` (DML) and `COMMIT` (transaction control) are allowed directly.",
    "id": 83
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "DBMS_OUTPUT.PUT_LINE does not print anything to your screen. What is the most likely cause?",
    "answers": [
      {
        "text": "SET SERVEROUTPUT ON was not executed in the session.",
        "isCorrect": true
      },
      {
        "text": "DBMS_OUTPUT can only be used inside a procedure.",
        "isCorrect": false
      },
      {
        "text": "The block is missing a DECLARE section.",
        "isCorrect": false
      },
      {
        "text": "You must COMMIT before output is shown.",
        "isCorrect": false
      }
    ],
    "explanation": "The most common cause is that `SET SERVEROUTPUT ON` was not run in the session, so the output buffer is not displayed. `DBMS_OUTPUT` works in anonymous blocks too, and no `COMMIT` is needed to see output.",
    "id": 84
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Group functions such as MAX(), MIN(), AVG() cannot be used directly in a PL/SQL procedural assignment. To pick the largest of two PL/SQL variables, which function should you use instead?",
    "answers": [
      {
        "text": "GREATEST()",
        "isCorrect": true
      },
      {
        "text": "MAX()",
        "isCorrect": false
      },
      {
        "text": "HIGHEST()",
        "isCorrect": false
      },
      {
        "text": "TOP()",
        "isCorrect": false
      }
    ],
    "explanation": "To pick the larger of two PL/SQL values use the single-row function `GREATEST()` (and `LEAST()` for the smaller). `MAX()`/`MIN()` are group functions and only work inside SQL statements.",
    "id": 85
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "What is the purpose of the %TYPE attribute in a declaration such as 'v_sal employees.salary%TYPE;'?",
    "answers": [
      {
        "text": "It anchors the variable to the exact data type of the referenced table column, so the code adapts if the schema changes.",
        "isCorrect": true
      },
      {
        "text": "It copies the current value of the column into the variable.",
        "isCorrect": false
      },
      {
        "text": "It declares the variable as a full record of the table row.",
        "isCorrect": false
      },
      {
        "text": "It makes the variable a constant.",
        "isCorrect": false
      }
    ],
    "explanation": "`employees.salary%TYPE` anchors the variable to the exact data type of that column, so if the column's type changes the variable adapts automatically. It does not copy the column's value, does not make a record, and does not make a constant.",
    "id": 86
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "For a SELECT ... INTO statement in PL/SQL, which statements are correct?",
    "answers": [
      {
        "text": "The query must return exactly one row.",
        "isCorrect": true
      },
      {
        "text": "If the query returns zero rows, NO_DATA_FOUND is raised.",
        "isCorrect": true
      },
      {
        "text": "If the query returns more than one row, TOO_MANY_ROWS is raised.",
        "isCorrect": true
      },
      {
        "text": "If the query returns multiple rows, only the first row is silently used.",
        "isCorrect": false
      },
      {
        "text": "It can populate several variables at once (one per selected column).",
        "isCorrect": true
      }
    ],
    "explanation": "A `SELECT ... INTO` must return exactly one row: zero rows raises `NO_DATA_FOUND`, more than one raises `TOO_MANY_ROWS` (it never silently keeps the first). It can fill several variables at once, one per selected column.",
    "id": 87
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "How do you reference a bind (host) variable named g_price inside a PL/SQL block?",
    "answers": [
      {
        "text": "By prefixing it with a colon: :g_price",
        "isCorrect": true
      },
      {
        "text": "By prefixing it with an ampersand: &g_price",
        "isCorrect": false
      },
      {
        "text": "By prefixing it with a double colon: ::g_price",
        "isCorrect": false
      },
      {
        "text": "Just by its name: g_price",
        "isCorrect": false
      }
    ],
    "explanation": "A bind/host variable is referenced inside PL/SQL by prefixing its name with a colon: `:g_price`. The ampersand (`&`) is for SQL*Plus substitution variables, not bind variables.",
    "id": 88
  },
  {
    "source": "seminar",
    "type": "code",
    "question": "What does the following block display, in order?\n\nCode:\nDECLARE\n  var NUMBER;\nBEGIN\n  var := 1;\n  DBMS_OUTPUT.PUT_LINE(var);\n  <<bloc1>>\n  DECLARE\n    var NUMBER;\n  BEGIN\n    var := 2;\n    DBMS_OUTPUT.PUT_LINE(var);\n  END bloc1;\n  DBMS_OUTPUT.PUT_LINE(var);\nEND;",
    "answers": [
      {
        "text": "1, 2, 1",
        "isCorrect": true
      },
      {
        "text": "1, 2, 2",
        "isCorrect": false
      },
      {
        "text": "1, 1, 1",
        "isCorrect": false
      },
      {
        "text": "2, 2, 1",
        "isCorrect": false
      }
    ],
    "explanation": "The outer `var` is set to 1 and printed (`1`). The inner block declares its *own* `var` set to 2 and prints it (`2`). After the inner block ends, that inner `var` is gone and the outer `var` (still 1) is printed (`1`). Output: 1, 2, 1.",
    "id": 89,
    "annotations": [
      {
        "n": 1,
        "find": "<<bloc1>>",
        "note": "Starts a nested block with its own var, separate from the outer one."
      },
      {
        "n": 2,
        "find": "  DBMS_OUTPUT.PUT_LINE(var);\nEND;",
        "note": "Back in the outer scope: the outer var is still 1."
      }
    ],
    "walkthrough": [
      "Outer `var := 1`; the first `PUT_LINE` prints `1`.",
      "The inner block declares its own `var := 2`; its `PUT_LINE` prints `2`.",
      "After the inner block ends, its `var` is gone and the outer `var` (still `1`) is in scope.",
      "The last `PUT_LINE` prints `1`.",
      "Output: `1, 2, 1`."
    ]
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "A variable declared as NOT NULL or as a CONSTANT in PL/SQL:",
    "answers": [
      {
        "text": "Must be assigned a value immediately in the same declaration.",
        "isCorrect": true
      },
      {
        "text": "Can be left uninitialized and defaults to NULL.",
        "isCorrect": false
      },
      {
        "text": "Can only be initialized later inside the BEGIN block.",
        "isCorrect": false
      },
      {
        "text": "Cannot be declared in the DECLARE section.",
        "isCorrect": false
      }
    ],
    "explanation": "A `CONSTANT` or a `NOT NULL` variable must be given a value in its own declaration, because it can never legitimately hold `NULL` (and a constant can never be assigned later).",
    "id": 90
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Which is the correct PL/SQL keyword for an 'else if' branch?",
    "answers": [
      {
        "text": "ELSIF",
        "isCorrect": true
      },
      {
        "text": "ELSEIF",
        "isCorrect": false
      },
      {
        "text": "ELSE IF",
        "isCorrect": false
      },
      {
        "text": "ELIF",
        "isCorrect": false
      }
    ],
    "explanation": "The correct keyword is `ELSIF` (one word, no second E). `ELSEIF`, `ELSE IF` and `ELIF` are not valid PL/SQL.",
    "id": 91
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "An uninitialized variable v (NULL) is tested in 'IF v >= 5 THEN ... ELSE ... END IF;'. What happens?",
    "answers": [
      {
        "text": "The comparison evaluates to NULL (not TRUE), so the ELSE branch executes.",
        "isCorrect": true
      },
      {
        "text": "The comparison evaluates to FALSE, so the ELSE branch executes after raising a warning.",
        "isCorrect": false
      },
      {
        "text": "An exception is raised because v is NULL.",
        "isCorrect": false
      },
      {
        "text": "The THEN branch executes because NULL is treated as 0.",
        "isCorrect": false
      }
    ],
    "explanation": "Comparing with a `NULL` yields `NULL`, which is not TRUE, so the `IF` does not take the `THEN` branch and the `ELSE` runs. No exception is raised — `NULL` is simply not treated as 0 or FALSE here.",
    "id": 92
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Regarding CASE in PL/SQL, which statements are correct?",
    "answers": [
      {
        "text": "A CASE expression returns a value and ends with END.",
        "isCorrect": true
      },
      {
        "text": "A CASE statement executes instructions and ends with END CASE;",
        "isCorrect": true
      },
      {
        "text": "A CASE statement with no ELSE that matches no condition raises a runtime exception (CASE_NOT_FOUND).",
        "isCorrect": true
      },
      {
        "text": "A CASE statement and a CASE expression are interchangeable and both end with END CASE;",
        "isCorrect": false
      }
    ],
    "explanation": "A `CASE` *expression* returns a value and ends with `END`; a `CASE` *statement* runs statements and ends with `END CASE;`. A `CASE` statement with no matching `WHEN` and no `ELSE` raises `CASE_NOT_FOUND`. The two forms are not interchangeable.",
    "id": 93
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "In a numeric FOR loop such as 'FOR i IN 100..110 LOOP ... END LOOP;', the loop counter i:",
    "answers": [
      {
        "text": "Is implicitly declared, is an integer, and exists only inside the loop.",
        "isCorrect": true
      },
      {
        "text": "Must be declared in the DECLARE section before the loop.",
        "isCorrect": false
      },
      {
        "text": "Remains accessible after the loop ends.",
        "isCorrect": false
      },
      {
        "text": "Can be assigned a new value with := inside the loop body.",
        "isCorrect": false
      }
    ],
    "explanation": "In a numeric `FOR` loop the counter is declared implicitly, is an integer, and exists only inside the loop. You cannot assign to it, and it is not accessible after the loop ends.",
    "id": 94
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Which PL/SQL loop guarantees that its body executes at least once?",
    "answers": [
      {
        "text": "The basic LOOP ... EXIT WHEN ... END LOOP.",
        "isCorrect": true
      },
      {
        "text": "The WHILE loop.",
        "isCorrect": false
      },
      {
        "text": "The numeric FOR loop.",
        "isCorrect": false
      },
      {
        "text": "The cursor FOR loop.",
        "isCorrect": false
      }
    ],
    "explanation": "The basic `LOOP ... EXIT WHEN ... END LOOP` always runs its body at least once, because the exit test is checked *after* the body. `WHILE` and `FOR` loops test before running, so their body may run zero times.",
    "id": 95
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "In PL/SQL, what is the difference between = and :=?",
    "answers": [
      {
        "text": ":= is the assignment operator and = is the equality (comparison) operator.",
        "isCorrect": true
      },
      {
        "text": "= is the assignment operator and := is the comparison operator.",
        "isCorrect": false
      },
      {
        "text": "They are interchangeable.",
        "isCorrect": false
      },
      {
        "text": "= is used for numbers and := is used for strings.",
        "isCorrect": false
      }
    ],
    "explanation": "`:=` is the assignment operator (store a value into a variable) and `=` is the equality/comparison operator (used in conditions). They are not interchangeable.",
    "id": 96
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "What does declaring 'vrec_dep departments%ROWTYPE;' create?",
    "answers": [
      {
        "text": "A record whose fields match the names, data types and order of the departments table columns.",
        "isCorrect": true
      },
      {
        "text": "A single scalar variable of the first column's type.",
        "isCorrect": false
      },
      {
        "text": "A collection holding all rows of the departments table.",
        "isCorrect": false
      },
      {
        "text": "A cursor over the departments table.",
        "isCorrect": false
      }
    ],
    "explanation": "`departments%ROWTYPE` creates a record whose fields match the names, data types and order of the `departments` table's columns. It is not a scalar, a collection, or a cursor.",
    "id": 97
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Which collection types can be stored directly in the database (as a column type)?",
    "answers": [
      {
        "text": "Nested tables",
        "isCorrect": true
      },
      {
        "text": "VARRAYs",
        "isCorrect": true
      },
      {
        "text": "Index-by tables (associative arrays)",
        "isCorrect": false
      }
    ],
    "explanation": "Nested tables and `VARRAY`s can be used as column types and stored in the database. Index-by tables (associative arrays) exist only in PL/SQL memory and cannot be stored in a table.",
    "id": 98
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Which Oracle collection type is always dense and has a fixed maximum size?",
    "answers": [
      {
        "text": "VARRAY (variable-size array)",
        "isCorrect": true
      },
      {
        "text": "Index-by table (associative array)",
        "isCorrect": false
      },
      {
        "text": "Nested table",
        "isCorrect": false
      },
      {
        "text": "A %ROWTYPE record",
        "isCorrect": false
      }
    ],
    "explanation": "A `VARRAY` is always dense (no gaps) and has a fixed maximum size set at definition. Associative arrays and nested tables can be sparse, and a `%ROWTYPE` is a record, not a collection.",
    "id": 99
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "When reading an associative array (index-by table) by iterating from .FIRST to .LAST, why is it safest to wrap access in 'IF coll.EXISTS(i) THEN ...'?",
    "answers": [
      {
        "text": "Because the keys can be sparse, so some indexes between FIRST and LAST may not exist, and accessing them would raise an error.",
        "isCorrect": true
      },
      {
        "text": "Because EXISTS is required to read any collection element.",
        "isCorrect": false
      },
      {
        "text": "Because .FIRST and .LAST are not reliable for associative arrays.",
        "isCorrect": false
      },
      {
        "text": "Because associative arrays are read-only otherwise.",
        "isCorrect": false
      }
    ],
    "explanation": "Associative arrays can be sparse (keys need not be contiguous), so when looping from `.FIRST` to `.LAST` some indexes in between may not exist; reading a missing index raises `NO_DATA_FOUND`, so you guard each access with `EXISTS(i)`.",
    "id": 100
  },
  {
    "source": "seminar",
    "type": "code",
    "question": "What does the following block display?\n\nCode:\nDECLARE\n  TYPE t_clients IS TABLE OF VARCHAR2(100) INDEX BY PLS_INTEGER;\n  v_client t_clients;\nBEGIN\n  v_client(-100) := 'JOHN';\n  v_client(5) := 'Mary';\n  v_client(999) := 'Peter';\n  v_client(500000000) := 'Anna';\n  DBMS_OUTPUT.PUT_LINE(v_client.COUNT);\n  DBMS_OUTPUT.PUT_LINE(v_client.FIRST);\n  DBMS_OUTPUT.PUT_LINE(v_client.LAST);\nEND;",
    "answers": [
      {
        "text": "4, then -100, then 500000000",
        "isCorrect": true
      },
      {
        "text": "4, then 1, then 4",
        "isCorrect": false
      },
      {
        "text": "500000100, then -100, then 500000000",
        "isCorrect": false
      },
      {
        "text": "An error, because indexes cannot be negative.",
        "isCorrect": false
      }
    ],
    "explanation": "Indexes can be any `PLS_INTEGER`, including negatives. Four keys are assigned, so `COUNT` is `4`. `FIRST` returns the lowest index (`-100`) and `LAST` the highest (`500000000`). The count is the number of elements, not the index range.",
    "id": 101,
    "annotations": [
      {
        "n": 1,
        "find": "DBMS_OUTPUT.PUT_LINE(v_client.COUNT)",
        "note": "4 keys were assigned, so COUNT = 4."
      },
      {
        "n": 2,
        "find": "DBMS_OUTPUT.PUT_LINE(v_client.FIRST)",
        "note": "FIRST is the smallest index = -100; LAST is the largest = 500000000."
      }
    ],
    "walkthrough": [
      "Four keys are assigned (`-100`, `5`, `999`, `500000000`), so `COUNT` is `4`.",
      "Associative-array indexes may be any `PLS_INTEGER`, including negatives.",
      "`FIRST` returns the lowest index, `-100`; `LAST` returns the highest, `500000000`.",
      "Output: `4`, then `-100`, then `500000000`."
    ]
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "What is the correct lifecycle order for working with an explicit cursor manually?",
    "answers": [
      {
        "text": "DECLARE, OPEN, FETCH, CLOSE",
        "isCorrect": true
      },
      {
        "text": "OPEN, DECLARE, FETCH, CLOSE",
        "isCorrect": false
      },
      {
        "text": "DECLARE, FETCH, OPEN, CLOSE",
        "isCorrect": false
      },
      {
        "text": "OPEN, FETCH, CLOSE, DECLARE",
        "isCorrect": false
      }
    ],
    "explanation": "The manual lifecycle of an explicit cursor is: `DECLARE` it, `OPEN` it, `FETCH` rows from it, then `CLOSE` it.",
    "id": 102
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "When manually fetching from an explicit cursor in a loop, where should 'EXIT WHEN c%NOTFOUND;' be placed?",
    "answers": [
      {
        "text": "Immediately after the FETCH, otherwise the last row is processed twice.",
        "isCorrect": true
      },
      {
        "text": "At the very bottom of the loop, after processing the row.",
        "isCorrect": false
      },
      {
        "text": "Before the FETCH statement.",
        "isCorrect": false
      },
      {
        "text": "Outside the loop, right after CLOSE.",
        "isCorrect": false
      }
    ],
    "explanation": "`EXIT WHEN c%NOTFOUND;` goes immediately after the `FETCH`. The `FETCH` past the last row leaves the record unchanged and sets `%NOTFOUND` to TRUE; exiting right away avoids processing that last row a second time.",
    "id": 103
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "When a cursor is used in a cursor FOR loop ('FOR rec IN c LOOP ...'), which operations does Oracle handle automatically?",
    "answers": [
      {
        "text": "OPEN the cursor",
        "isCorrect": true
      },
      {
        "text": "FETCH each row",
        "isCorrect": true
      },
      {
        "text": "CLOSE the cursor",
        "isCorrect": true
      },
      {
        "text": "Create the record variable (rec)",
        "isCorrect": true
      },
      {
        "text": "DECLARE the cursor",
        "isCorrect": false
      }
    ],
    "explanation": "In a cursor `FOR` loop Oracle automatically opens the cursor, fetches each row, closes the cursor at the end, and creates the loop record variable. You still have to declare the cursor itself.",
    "id": 104
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "What does 'WHERE CURRENT OF cursor_name' allow you to do?",
    "answers": [
      {
        "text": "UPDATE or DELETE the exact row the cursor is currently pointing at (the cursor must be declared FOR UPDATE).",
        "isCorrect": true
      },
      {
        "text": "Re-open the cursor at the current position.",
        "isCorrect": false
      },
      {
        "text": "Skip the current row and fetch the next one.",
        "isCorrect": false
      },
      {
        "text": "Lock the entire table for the duration of the loop.",
        "isCorrect": false
      }
    ],
    "explanation": "`WHERE CURRENT OF cursor_name` lets an `UPDATE`/`DELETE` act on the exact row the cursor last fetched. The cursor must be declared `FOR UPDATE` so that row is locked.",
    "id": 105
  },
  {
    "source": "seminar",
    "type": "code",
    "question": "What does the following block display if no product with product_id = 113 exists?\n\nCode:\nBEGIN\n  UPDATE product_information SET product_name = 'PC' WHERE product_id = 113;\n  IF SQL%NOTFOUND THEN\n    DBMS_OUTPUT.PUT_LINE('The product 113 doesn''t exist');\n  END IF;\n  DBMS_OUTPUT.PUT_LINE(SQL%ROWCOUNT || ' rows were modified.');\nEND;",
    "answers": [
      {
        "text": "The product 113 doesn't exist\\n0 rows were modified.",
        "isCorrect": true
      },
      {
        "text": "Nothing, because no rows matched.",
        "isCorrect": false
      },
      {
        "text": "It raises NO_DATA_FOUND.",
        "isCorrect": false
      },
      {
        "text": "1 rows were modified.",
        "isCorrect": false
      }
    ],
    "explanation": "No row matches `product_id = 113`, so the `UPDATE` affects 0 rows: `SQL%NOTFOUND` is TRUE, so it prints \"The product 113 doesn't exist\", then `SQL%ROWCOUNT` is `0`, so it prints \"0 rows were modified.\" An `UPDATE` with no match does not raise `NO_DATA_FOUND`.",
    "id": 106,
    "annotations": [
      {
        "n": 1,
        "find": "IF SQL%NOTFOUND THEN",
        "note": "No row matched, so SQL%NOTFOUND is TRUE here."
      },
      {
        "n": 2,
        "find": "SQL%ROWCOUNT || ' rows were modified.'",
        "note": "SQL%ROWCOUNT is 0."
      }
    ],
    "walkthrough": [
      "No row has `product_id = 113`, so the `UPDATE` affects 0 rows.",
      "`SQL%NOTFOUND` is `TRUE`, so it prints `The product 113 doesn't exist`.",
      "`SQL%ROWCOUNT` is `0`, so it prints `0 rows were modified.`",
      "An `UPDATE` with no match does not raise `NO_DATA_FOUND`."
    ]
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "What does BULK COLLECT do?",
    "answers": [
      {
        "text": "It runs a query and loads the entire result set into a PL/SQL collection in a single operation.",
        "isCorrect": true
      },
      {
        "text": "It fetches one row at a time into a record.",
        "isCorrect": false
      },
      {
        "text": "It permanently stores a collection into a database table.",
        "isCorrect": false
      },
      {
        "text": "It deletes all rows of a collection.",
        "isCorrect": false
      }
    ],
    "explanation": "`BULK COLLECT` runs a query and loads its entire result set into a PL/SQL collection in a single fetch, instead of one row at a time — far fewer context switches.",
    "id": 107
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "What is the safest pattern to loop over a possibly sparse collection (where elements may have been deleted)?",
    "answers": [
      {
        "text": "i := coll.FIRST; WHILE i IS NOT NULL LOOP ... i := coll.NEXT(i); END LOOP;",
        "isCorrect": true
      },
      {
        "text": "FOR i IN 1..coll.COUNT LOOP ... END LOOP;",
        "isCorrect": false
      },
      {
        "text": "FOR i IN coll.FIRST..coll.LAST LOOP ... END LOOP;",
        "isCorrect": false
      },
      {
        "text": "LOOP ... EXIT WHEN coll.COUNT = 0; END LOOP;",
        "isCorrect": false
      }
    ],
    "explanation": "For a possibly sparse collection, walk it by index with `i := coll.FIRST; WHILE i IS NOT NULL LOOP ... i := coll.NEXT(i); END LOOP;`. A numeric `FOR` over `1..COUNT` or `FIRST..LAST` would hit non-existent indexes and fail.",
    "id": 108
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "BULK COLLECT is very fast but consumes server memory. In enterprise code, how do you keep it safe on very large tables?",
    "answers": [
      {
        "text": "Process data in batches using a LIMIT clause (e.g. FETCH cur BULK COLLECT INTO coll LIMIT 1000;).",
        "isCorrect": true
      },
      {
        "text": "Add a COMMIT after every fetched row.",
        "isCorrect": false
      },
      {
        "text": "Use a basic LOOP instead of a WHILE loop.",
        "isCorrect": false
      },
      {
        "text": "Declare the collection as a VARRAY of size 1.",
        "isCorrect": false
      }
    ],
    "explanation": "To bound memory, fetch in batches with a `LIMIT`, e.g. `FETCH cur BULK COLLECT INTO coll LIMIT 1000;` inside a loop. Committing per row or shrinking the collection to size 1 would defeat the performance benefit.",
    "id": 109
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "The collection method .TRIM(n):",
    "answers": [
      {
        "text": "Removes n elements from the end of a VARRAY or nested table.",
        "isCorrect": true
      },
      {
        "text": "Removes n elements from the beginning of the collection.",
        "isCorrect": false
      },
      {
        "text": "Removes elements with NULL values.",
        "isCorrect": false
      },
      {
        "text": "Is the standard way to clear an associative array.",
        "isCorrect": false
      }
    ],
    "explanation": "`TRIM(n)` removes `n` elements from the *end* of a `VARRAY` or nested table. It does not remove from the front, does not target NULLs, and is not used on associative arrays.",
    "id": 110
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Which of the following are Oracle pre-defined exceptions (no declaration needed)?",
    "answers": [
      {
        "text": "NO_DATA_FOUND (a SELECT INTO returned zero rows)",
        "isCorrect": true
      },
      {
        "text": "TOO_MANY_ROWS (a SELECT INTO returned multiple rows)",
        "isCorrect": true
      },
      {
        "text": "ZERO_DIVIDE (division by zero)",
        "isCorrect": true
      },
      {
        "text": "INSUFFICIENT_CREDIT (a business rule was violated)",
        "isCorrect": false
      }
    ],
    "explanation": "`NO_DATA_FOUND`, `TOO_MANY_ROWS` and `ZERO_DIVIDE` are Oracle predefined exceptions you can catch without declaring them. \"INSUFFICIENT_CREDIT\" is a business rule, so it would be a user-defined exception.",
    "id": 111
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "To catch a standard Oracle error that has an ORA- code but no predefined name, you must:",
    "answers": [
      {
        "text": "Declare your own exception name and link it to the ORA- code with PRAGMA EXCEPTION_INIT.",
        "isCorrect": true
      },
      {
        "text": "Catch it only with WHEN OTHERS; it cannot be named.",
        "isCorrect": false
      },
      {
        "text": "Use RAISE_APPLICATION_ERROR to rename it.",
        "isCorrect": false
      },
      {
        "text": "Nothing special; all ORA- errors already have names.",
        "isCorrect": false
      }
    ],
    "explanation": "For a standard ORA- error that has no predefined name, declare your own exception and link it to the error number with `PRAGMA EXCEPTION_INIT(my_exc, -nnnnn)`, then catch it by that name.",
    "id": 112
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "When using RAISE_APPLICATION_ERROR, the custom error number must be in which range?",
    "answers": [
      {
        "text": "Between -20000 and -20999",
        "isCorrect": true
      },
      {
        "text": "Between -1 and -999",
        "isCorrect": false
      },
      {
        "text": "Between 20000 and 20999",
        "isCorrect": false
      },
      {
        "text": "Any negative number is allowed",
        "isCorrect": false
      }
    ],
    "explanation": "In `RAISE_APPLICATION_ERROR`, the custom error number must be in the range `-20000` to `-20999` (these are reserved for user-defined application errors).",
    "id": 113
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "In an EXCEPTION section, where must 'WHEN OTHERS THEN' be placed and why?",
    "answers": [
      {
        "text": "At the very bottom, because it is a catch-all that would otherwise intercept errors before the specific handlers run.",
        "isCorrect": true
      },
      {
        "text": "At the very top, so it can catch the error first.",
        "isCorrect": false
      },
      {
        "text": "Anywhere; ordering does not matter.",
        "isCorrect": false
      },
      {
        "text": "It must be the only handler in the section.",
        "isCorrect": false
      }
    ],
    "explanation": "`WHEN OTHERS` must be the last handler in the `EXCEPTION` section. As a catch-all it would otherwise intercept errors before the specific handlers had a chance to run.",
    "id": 114
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "An error occurs in an inner nested BEGIN...END block and is not handled there. What happens?",
    "answers": [
      {
        "text": "It propagates ('bubbles up') to the enclosing block's EXCEPTION section; if unhandled there too, the program fails.",
        "isCorrect": true
      },
      {
        "text": "It is silently ignored and execution continues.",
        "isCorrect": false
      },
      {
        "text": "Only the inner block stops; the outer block always continues normally.",
        "isCorrect": false
      },
      {
        "text": "It is automatically rolled back and re-run.",
        "isCorrect": false
      }
    ],
    "explanation": "An unhandled error in an inner block propagates (\"bubbles up\") to the enclosing block's `EXCEPTION` section; if it is unhandled there too, it propagates further and ultimately fails the program. It is not silently ignored.",
    "id": 115
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Regarding subprogram parameter modes, which statements are correct?",
    "answers": [
      {
        "text": "IN is the default and is read-only inside the subprogram.",
        "isCorrect": true
      },
      {
        "text": "OUT is used to write a value back to the caller.",
        "isCorrect": true
      },
      {
        "text": "IN OUT passes a value in, allows modification, and passes the new value back.",
        "isCorrect": true
      },
      {
        "text": "OUT parameters can be read (their incoming value used) like IN parameters.",
        "isCorrect": false
      }
    ],
    "explanation": "`IN` is the default and is read-only inside the subprogram; `OUT` writes a value back to the caller; `IN OUT` passes a value in, allows changing it, and returns it. An `OUT` parameter's incoming value is not available to read (it starts as NULL).",
    "id": 116
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "What distinguishes a function from a procedure in PL/SQL?",
    "answers": [
      {
        "text": "A function declares a RETURN type and must execute a RETURN statement that returns a value; a procedure does not return a value via RETURN.",
        "isCorrect": true
      },
      {
        "text": "A procedure can have parameters but a function cannot.",
        "isCorrect": false
      },
      {
        "text": "A function cannot contain SQL statements.",
        "isCorrect": false
      },
      {
        "text": "A procedure must always be inside a package, a function need not be.",
        "isCorrect": false
      }
    ],
    "explanation": "A function declares a `RETURN` type and must execute a `RETURN` that yields a value; a procedure does not return a value through `RETURN`. Both can have parameters and contain SQL, and neither has to be inside a package.",
    "id": 117
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "To call a user-defined function directly inside a SQL SELECT statement, the function must:",
    "answers": [
      {
        "text": "Have only IN parameters.",
        "isCorrect": true
      },
      {
        "text": "Have at least one OUT parameter.",
        "isCorrect": false
      },
      {
        "text": "Be declared inside a trigger.",
        "isCorrect": false
      },
      {
        "text": "Return a BOOLEAN value.",
        "isCorrect": false
      }
    ],
    "explanation": "To be callable from a SQL `SELECT`, a user-defined function must have only `IN` parameters (no `OUT`/`IN OUT`). It does not need to be in a trigger or to return BOOLEAN (in fact BOOLEAN is not a SQL type).",
    "id": 118
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "After running CREATE OR REPLACE PROCEDURE and seeing 'Warning: Procedure created with compilation errors', what command shows the exact error lines?",
    "answers": [
      {
        "text": "SHOW ERRORS;",
        "isCorrect": true
      },
      {
        "text": "LIST ERRORS;",
        "isCorrect": false
      },
      {
        "text": "DESCRIBE PROCEDURE;",
        "isCorrect": false
      },
      {
        "text": "SET SERVEROUTPUT ON;",
        "isCorrect": false
      }
    ],
    "explanation": "After a \"created with compilation errors\" warning, run `SHOW ERRORS;` (in SQL*Plus/SQL Developer) to list the exact line numbers and messages.",
    "id": 119
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Which statements about PL/SQL packages are correct?",
    "answers": [
      {
        "text": "The specification (header) is the public interface where subprograms are declared but not implemented.",
        "isCorrect": true
      },
      {
        "text": "The body contains the actual implementation and may hold private subprograms hidden from outside callers.",
        "isCorrect": true
      },
      {
        "text": "You must compile the specification before the body.",
        "isCorrect": true
      },
      {
        "text": "A package can have a body without a specification.",
        "isCorrect": false
      }
    ],
    "explanation": "A package specification is the public interface where subprograms are declared; the body holds the implementations and may contain private subprograms hidden from outside callers; and the specification must be compiled before the body. A body cannot exist without a specification.",
    "id": 120
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "What is subprogram overloading, and where is it allowed?",
    "answers": [
      {
        "text": "Defining several subprograms with the same name but different parameter lists; it is allowed inside a package.",
        "isCorrect": true
      },
      {
        "text": "Defining two standalone (schema-level) procedures with the same name.",
        "isCorrect": false
      },
      {
        "text": "Calling a procedure more times than it has parameters.",
        "isCorrect": false
      },
      {
        "text": "Re-declaring a variable with the same name in nested blocks.",
        "isCorrect": false
      }
    ],
    "explanation": "Overloading means defining several subprograms with the same name but different parameter lists; it is allowed inside a package (and in a block), but not for two standalone schema-level procedures with the same name.",
    "id": 121
  },
  {
    "source": "seminar",
    "type": "code",
    "question": "An UPDATE statement modifies 50 rows. How many times does each trigger fire?\n\nCode:\nCREATE OR REPLACE TRIGGER t_stmt\n  BEFORE UPDATE ON employees\nBEGIN ... END;\n/\nCREATE OR REPLACE TRIGGER t_row\n  BEFORE UPDATE ON employees\n  FOR EACH ROW\nBEGIN ... END;\n/",
    "answers": [
      {
        "text": "t_stmt fires once; t_row fires 50 times.",
        "isCorrect": true
      },
      {
        "text": "Both fire once.",
        "isCorrect": false
      },
      {
        "text": "Both fire 50 times.",
        "isCorrect": false
      },
      {
        "text": "t_stmt fires 50 times; t_row fires once.",
        "isCorrect": false
      }
    ],
    "explanation": "For an `UPDATE` of 50 rows, the statement-level trigger `t_stmt` (no `FOR EACH ROW`) fires once, while the row-level trigger `t_row` (`FOR EACH ROW`) fires once per affected row = 50 times.",
    "id": 122,
    "annotations": [
      {
        "n": 1,
        "find": "BEFORE UPDATE ON employees\nBEGIN",
        "note": "No FOR EACH ROW: statement-level, fires once."
      },
      {
        "n": 2,
        "find": "FOR EACH ROW",
        "note": "Row-level: fires once per affected row (50 times)."
      }
    ],
    "walkthrough": [
      "The `UPDATE` modifies 50 rows.",
      "`t_stmt` has no `FOR EACH ROW`, so it is a statement trigger: it fires once.",
      "`t_row` has `FOR EACH ROW`, so it fires once per affected row: 50 times.",
      "Result: `t_stmt` once, `t_row` 50 times."
    ]
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "What is the 'mutating table' error?",
    "answers": [
      {
        "text": "A row-level trigger firing on a table cannot run a SELECT (or DML) against that same table while it is changing.",
        "isCorrect": true
      },
      {
        "text": "Two triggers on the same table firing in the wrong order.",
        "isCorrect": false
      },
      {
        "text": "Changing a column's data type while rows exist.",
        "isCorrect": false
      },
      {
        "text": "Inserting into a table that has no primary key.",
        "isCorrect": false
      }
    ],
    "explanation": "The \"mutating table\" error happens when a row-level trigger tries to `SELECT` from (or modify) the very table whose change fired it, while that table is still being modified — Oracle blocks it to keep results consistent.",
    "id": 123
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Which built-in boolean conditional predicates can be tested inside a trigger that handles multiple events (BEFORE INSERT OR UPDATE OR DELETE)?",
    "answers": [
      {
        "text": "INSERTING",
        "isCorrect": true
      },
      {
        "text": "UPDATING",
        "isCorrect": true
      },
      {
        "text": "DELETING",
        "isCorrect": true
      },
      {
        "text": "SELECTING",
        "isCorrect": false
      }
    ],
    "explanation": "Inside a trigger that handles several events you can test the boolean predicates `INSERTING`, `UPDATING` and `DELETING` to tell which DML fired it. There is no `SELECTING` predicate (DML triggers do not fire on SELECT).",
    "id": 124
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Historically (before identity columns), how did Oracle implement an auto-incrementing primary key?",
    "answers": [
      {
        "text": "With a Sequence (generates unique numbers) plus a row-level BEFORE INSERT trigger that puts NEXTVAL into the key column.",
        "isCorrect": true
      },
      {
        "text": "With the AUTO_INCREMENT keyword on the column.",
        "isCorrect": false
      },
      {
        "text": "With a statement-level trigger that runs COUNT(*)+1.",
        "isCorrect": false
      },
      {
        "text": "With a CHECK constraint on the primary key.",
        "isCorrect": false
      }
    ],
    "explanation": "Before identity columns, auto-increment keys were built with a `SEQUENCE` (to generate unique numbers) plus a `BEFORE INSERT ... FOR EACH ROW` trigger that put `seq.NEXTVAL` into the key column. Oracle has no `AUTO_INCREMENT` keyword.",
    "id": 125
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "Consider a package with a public function no_cust and a private procedure count_cust declared only in the body. What happens if an outside block calls 'orders_pkg.count_cust(res);'?",
    "answers": [
      {
        "text": "It fails, because count_cust is private to the package body and not exposed in the specification.",
        "isCorrect": true
      },
      {
        "text": "It succeeds, because everything in a package body is public.",
        "isCorrect": false
      },
      {
        "text": "It succeeds only if called from inside a SELECT statement.",
        "isCorrect": false
      },
      {
        "text": "It fails, because private subprograms cannot have OUT parameters.",
        "isCorrect": false
      }
    ],
    "explanation": "Calling `orders_pkg.count_cust(res)` fails: `count_cust` is declared only in the package body, so it is private and not exposed in the specification — outside callers cannot see it. Only subprograms declared in the spec are public.",
    "id": 126
  },
  {
    "source": "seminar",
    "type": "theory",
    "question": "A package body can contain an initialization block (an unnamed BEGIN...END at the very end of the body). When does it run?",
    "answers": [
      {
        "text": "Once, the first time the package is referenced in a session.",
        "isCorrect": true
      },
      {
        "text": "Every time any package subprogram is called.",
        "isCorrect": false
      },
      {
        "text": "Only when the package is created/compiled.",
        "isCorrect": false
      },
      {
        "text": "Never; initialization blocks are not allowed in packages.",
        "isCorrect": false
      }
    ],
    "explanation": "A package body's initialization block (the unnamed `BEGIN ... END` at the end of the body) runs once per session, the first time the package is referenced — not on every call and not at compile time.",
    "id": 127
  },
  {
    "source": "exam",
    "type": "theory",
    "category": "past_exam",
    "question": "The attributes of an explicit cursor are:",
    "answers": [
      {
        "text": "ROWCOUNT, NO_DATA_FOUND, ISOPEN",
        "isCorrect": false
      },
      {
        "text": "ROWNUM, NOTFOUND, FOUND",
        "isCorrect": false
      },
      {
        "text": "ISOPEN, NOTFOUND, ROWCOUNT",
        "isCorrect": true
      },
      {
        "text": "FETCH, CLOSE, OPEN",
        "isCorrect": false
      },
      {
        "text": "ISCLOSE, FOUND, ROWCOUNT",
        "isCorrect": false
      }
    ],
    "explanation": "An explicit cursor has exactly four attributes: `%ISOPEN`, `%FOUND`, `%NOTFOUND` and `%ROWCOUNT`. Only that option lists valid ones. `NO_DATA_FOUND` is a predefined exception (not a cursor attribute), `ROWNUM` is a SQL pseudocolumn, `ISCLOSE` does not exist, and `OPEN`/`FETCH`/`CLOSE` are statements.",
    "id": 128
  },
  {
    "source": "exam",
    "type": "theory",
    "category": "past_exam",
    "question": "Specify which of the following statements about a DBMS are true:",
    "answers": [
      {
        "text": "A DBMS is a set of interconnected elements that contribute to building and operating a database application.",
        "isCorrect": true
      },
      {
        "text": "One of the objectives of a DBMS is to ensure the logical and physical independence of data.",
        "isCorrect": true
      },
      {
        "text": "The component architecture of a DBMS consists of: kernel, database and tools.",
        "isCorrect": false
      },
      {
        "text": "The basic functions of a DBMS are: ensuring minimal and controlled redundancy, data manipulation, data shareability, optimization.",
        "isCorrect": false
      },
      {
        "text": "A DBMS has as its objective ensuring the global performance of the application and the shareability of computing resources.",
        "isCorrect": false
      }
    ],
    "explanation": "A DBMS is a set of interconnected components that support building and operating a database application, and one of its central goals is logical and physical data independence — applications are insulated from changes in the logical or physical structure of the data.",
    "id": 129
  },
  {
    "source": "exam",
    "type": "theory",
    "category": "past_exam",
    "question": "Among the roles of a DBMS are:",
    "answers": [
      {
        "text": "defining the database structure according to a data model",
        "isCorrect": true
      },
      {
        "text": "data manipulation",
        "isCorrect": true
      },
      {
        "text": "ensuring the security of the database",
        "isCorrect": true
      },
      {
        "text": "managing the resources of the computer system",
        "isCorrect": false
      },
      {
        "text": "optimizing space and computing resources",
        "isCorrect": false
      }
    ],
    "explanation": "The roles of a DBMS include defining the database structure according to a data model, manipulating the data, and enforcing database security. Managing the computer system's resources and optimizing physical space are responsibilities of the operating system, not the DBMS.",
    "id": 130
  },
  {
    "source": "exam",
    "type": "code",
    "category": "past_exam",
    "question": "Consider the following PL/SQL block:\nCode:\nSET SERVEROUTPUT ON\nDECLARE\n  CURSOR cursor1 IS SELECT employee_id, last_name FROM employees ORDER BY salary DESC;\n  vid employees.employee_id%TYPE;\n  vname CHAR(20);\nBEGIN\n  OPEN cursor1;\n  FETCH cursor1 INTO vid, vname;\n  DBMS_OUTPUT.PUT_LINE('Employee '||vname);\n  CLOSE cursor1;\nEND;\n/\nWhich of the following statements are correct:",
    "answers": [
      {
        "text": "it displays the name of the employee with the highest salary",
        "isCorrect": true
      },
      {
        "text": "it works with an explicit cursor",
        "isCorrect": true
      },
      {
        "text": "it declares two scalar variables",
        "isCorrect": true
      },
      {
        "text": "it works with an implicit cursor",
        "isCorrect": false
      },
      {
        "text": "the PL/SQL block is erroneous because the loop structure is missing",
        "isCorrect": false
      }
    ],
    "explanation": "The block uses an explicit cursor whose query is ordered by `salary DESC`, so the single `FETCH` reads the first row — the highest-paid employee — and prints that name. It declares two scalar variables (`vid` and `vname`). A single fetch needs no loop, and the cursor is explicit, not implicit.",
    "annotations": [
      {
        "n": 1,
        "find": "ORDER BY salary DESC",
        "note": "Sorts so the highest salary is the first row; the single FETCH reads that top row."
      },
      {
        "n": 2,
        "find": "FETCH cursor1 INTO vid, vname;",
        "note": "Only one row is fetched, so only the top-salary employee is shown."
      },
      {
        "n": 3,
        "find": "vid employees.employee_id%TYPE;",
        "note": "First of two scalar variables declared (`vid`, `vname`)."
      }
    ],
    "walkthrough": [
      "The cursor query is `ORDER BY salary DESC`, so row 1 is the highest-paid employee.",
      "`OPEN` then a single `FETCH` reads that first row into `vid`, `vname`.",
      "It prints that one name; `CLOSE` releases the cursor.",
      "Output: the name of the highest-salary employee."
    ],
    "id": 131
  },
  {
    "source": "exam",
    "type": "code",
    "category": "past_exam",
    "question": "What does the following PL/SQL block display?\nCode:\nset serveroutput on;\ndeclare\n  type t_nt is table of number;\n  v_nt t_nt := t_nt(10, 20, 30, 40);\n  v_exists varchar2(3);\nbegin\n  v_nt.delete(2);\n  if v_nt.exists(2) then\n    v_exists := 'YES';\n  else\n    v_exists := 'NO';\n  end if;\n  dbms_output.put_line(v_nt.count || '-' || v_nt.first || '-' || v_nt.last || '-' || v_exists);\nend;",
    "answers": [
      {
        "text": "3-1-4-NO",
        "isCorrect": true
      },
      {
        "text": "Raises NO_DATA_FOUND",
        "isCorrect": false
      },
      {
        "text": "3-1-3-NO",
        "isCorrect": false
      },
      {
        "text": "4-1-4-NO",
        "isCorrect": false
      },
      {
        "text": "4-1-4-YES",
        "isCorrect": false
      }
    ],
    "explanation": "The nested table starts with 4 elements at indexes 1..4. `delete(2)` removes index 2, leaving indexes 1, 3, 4 — so `COUNT` is `3`, `FIRST` is `1`, `LAST` is `4`. `exists(2)` is now `FALSE`, so `v_exists` is `NO`. `DELETE` leaves a gap and does not renumber, so `LAST` stays `4`. Output: `3-1-4-NO`.",
    "annotations": [
      {
        "n": 1,
        "find": "v_nt.delete(2);",
        "note": "Removes the element at index 2, leaving a gap (indexes 1, 3, 4)."
      },
      {
        "n": 2,
        "find": "v_nt.exists(2)",
        "note": "Index 2 no longer exists, so this is FALSE -> `NO`."
      },
      {
        "n": 3,
        "find": "v_nt.count || '-' || v_nt.first || '-' || v_nt.last",
        "note": "COUNT=3, FIRST=1, LAST=4 (the gap does not change FIRST/LAST)."
      }
    ],
    "walkthrough": [
      "Start: 4 elements at indexes 1, 2, 3, 4.",
      "`delete(2)` removes index 2 -> remaining indexes 1, 3, 4.",
      "`COUNT`=3, `FIRST`=1, `LAST`=4; `exists(2)`=FALSE -> `NO`.",
      "Output: `3-1-4-NO`."
    ],
    "id": 132
  },
  {
    "source": "exam",
    "type": "code",
    "category": "past_exam",
    "question": "Consider the table employees(employee_id number primary key, salary number). No employee has employee_id = 999. What does the following PL/SQL block display?\nCode:\nset serveroutput on;\ndeclare\n  v_salary employees.salary%type;\nbegin\n  select salary into v_salary from employees where employee_id = 999;\n  dbms_output.put_line(v_salary);\nexception\n  when no_data_found then\n    dbms_output.put_line('No such employee');\nend;",
    "answers": [
      {
        "text": "No such employee",
        "isCorrect": true
      },
      {
        "text": "The block does not compile",
        "isCorrect": false
      },
      {
        "text": "NULL",
        "isCorrect": false
      },
      {
        "text": "0",
        "isCorrect": false
      },
      {
        "text": "Raises TOO_MANY_ROWS",
        "isCorrect": false
      }
    ],
    "explanation": "The `SELECT ... INTO` finds no row for `employee_id = 999`, which raises `NO_DATA_FOUND`. The handler catches it and prints `No such employee`. A `SELECT INTO` returning zero rows always raises `NO_DATA_FOUND` — it never silently returns `NULL`.",
    "annotations": [
      {
        "n": 1,
        "find": "select salary into v_salary from employees where employee_id = 999;",
        "note": "Matches no row, so SELECT INTO raises NO_DATA_FOUND."
      },
      {
        "n": 2,
        "find": "when no_data_found then",
        "note": "Catches that exception and prints the message."
      }
    ],
    "walkthrough": [
      "`SELECT salary INTO v_salary ... WHERE employee_id = 999` matches no row.",
      "Zero rows from a `SELECT INTO` raises `NO_DATA_FOUND`.",
      "The handler catches it and prints `No such employee`."
    ],
    "id": 133
  },
  {
    "source": "exam",
    "type": "code",
    "category": "past_exam",
    "question": "What does the following PL/SQL block display?\nCode:\nset serveroutput on;\ndeclare\n  type t_nt is table of number;\n  v_nt t_nt := t_nt(5, 10, 15);\nbegin\n  v_nt.trim;\n  dbms_output.put_line(v_nt.count || '-' || v_nt.last);\nend;",
    "answers": [
      {
        "text": "2-2",
        "isCorrect": true
      },
      {
        "text": "Raises COLLECTION_IS_NULL",
        "isCorrect": false
      },
      {
        "text": "2-3",
        "isCorrect": false
      },
      {
        "text": "1-2",
        "isCorrect": false
      },
      {
        "text": "3-3",
        "isCorrect": false
      }
    ],
    "explanation": "The nested table has 3 elements (indexes 1..3). `TRIM` with no argument removes one element from the end, leaving indexes 1 and 2. So `COUNT` is `2` and `LAST` is `2`. Output: `2-2`.",
    "annotations": [
      {
        "n": 1,
        "find": "v_nt.trim;",
        "note": "Removes one element from the END of the collection (3 -> 2)."
      },
      {
        "n": 2,
        "find": "v_nt.count || '-' || v_nt.last",
        "note": "After trim: COUNT=2 and LAST=2."
      }
    ],
    "walkthrough": [
      "Start: 3 elements at indexes 1, 2, 3.",
      "`trim` removes the last element -> indexes 1, 2.",
      "`COUNT`=2, `LAST`=2.",
      "Output: `2-2`."
    ],
    "id": 134
  },
  {
    "source": "exam",
    "type": "code",
    "category": "past_exam",
    "question": "The following package is created:\nCode:\ncreate or replace package counter_pkg as\n  g_nr number := 0;\n  procedure increment;\nend counter_pkg;\n/\ncreate or replace package body counter_pkg as\n  procedure increment is\n  begin\n    g_nr := g_nr + 1;\n    dbms_output.put_line(g_nr);\n  end;\nend counter_pkg;\n/\nset serveroutput on;\nbegin\n  counter_pkg.increment;\n  counter_pkg.increment;\nend;\nWhat does the block display, in a new session?",
    "answers": [
      {
        "text": "1 and 2",
        "isCorrect": true
      },
      {
        "text": "The block does not compile, because packages cannot have global variables",
        "isCorrect": false
      },
      {
        "text": "0 and 0",
        "isCorrect": false
      },
      {
        "text": "2 and 2",
        "isCorrect": false
      },
      {
        "text": "1 and 1",
        "isCorrect": false
      }
    ],
    "explanation": "A package-level variable like `g_nr` is session state: it keeps its value between calls within the same session. The first `increment` sets `g_nr` to `1` and prints `1`; the second sets it to `2` and prints `2`. Packages can hold global (package-level) variables — that is exactly what `g_nr` is.",
    "annotations": [
      {
        "n": 1,
        "find": "g_nr number := 0;",
        "note": "Package-level variable: initialised once per session, then persists across calls."
      },
      {
        "n": 2,
        "find": "g_nr := g_nr + 1;",
        "note": "Each call increments the retained value: 0->1, then 1->2."
      }
    ],
    "walkthrough": [
      "`g_nr` starts at `0` the first time the package is referenced in the session.",
      "First `increment`: `g_nr` becomes `1`, prints `1`.",
      "Second `increment`: `g_nr` becomes `2`, prints `2`.",
      "Output: `1` then `2`."
    ],
    "id": 135
  },
  {
    "source": "exam",
    "type": "code",
    "category": "past_exam",
    "question": "What does the following PL/SQL block display?\nCode:\nset serveroutput on;\ndeclare\n  v_salary number := -100;\nbegin\n  if v_salary < 0 then\n    raise_application_error(-20010, 'Invalid salary');\n  end if;\n  dbms_output.put_line('Valid');\nexception\n  when others then\n    dbms_output.put_line(sqlcode);\nend;",
    "answers": [
      {
        "text": "-20010",
        "isCorrect": true
      },
      {
        "text": "The block does not compile, because RAISE_APPLICATION_ERROR cannot be called from an anonymous block",
        "isCorrect": false
      },
      {
        "text": "Invalid salary",
        "isCorrect": false
      },
      {
        "text": "Valid",
        "isCorrect": false
      },
      {
        "text": "20010",
        "isCorrect": false
      }
    ],
    "explanation": "`v_salary` is `-100`, so the `IF` is true and `raise_application_error(-20010, ...)` raises an error whose code is `-20010`. `WHEN OTHERS` catches it and prints `SQLCODE`, which is `-20010`. `RAISE_APPLICATION_ERROR` is allowed in anonymous blocks, and `SQLCODE` returns the negative error number, not its absolute value.",
    "annotations": [
      {
        "n": 1,
        "find": "raise_application_error(-20010, 'Invalid salary')",
        "note": "Raises a user error with code -20010 and the given message."
      },
      {
        "n": 2,
        "find": "dbms_output.put_line(sqlcode)",
        "note": "`SQLCODE` of the caught error is -20010."
      }
    ],
    "walkthrough": [
      "`v_salary = -100`, so `v_salary < 0` is true.",
      "`raise_application_error(-20010, ...)` raises an error with code `-20010`.",
      "`WHEN OTHERS` catches it; `SQLCODE` is `-20010`.",
      "Output: `-20010`."
    ],
    "id": 136
  },
  {
    "source": "exam",
    "type": "theory",
    "category": "past_exam",
    "question": "Which statement about PL/SQL collection types is correct?",
    "answers": [
      {
        "text": "An associative array (index-by table) can use arbitrary index values and does not need a constructor before its first assignment.",
        "isCorrect": true
      },
      {
        "text": "BULK COLLECT can only populate collections of VARRAY type.",
        "isCorrect": false
      },
      {
        "text": "A VARRAY allows gaps between indexes but preserves the order of elements.",
        "isCorrect": false
      },
      {
        "text": "The FIRST and LAST methods always return 1 and COUNT for any collection.",
        "isCorrect": false
      },
      {
        "text": "A nested table always keeps consecutive indexes, even after DELETE.",
        "isCorrect": false
      }
    ],
    "explanation": "An associative array (`INDEX BY` table) is the only collection used without a constructor — you simply assign to a key — and its keys may be arbitrary (`PLS_INTEGER` or `VARCHAR2`), not necessarily contiguous. `BULK COLLECT` works with any collection type, a `VARRAY` is always dense (no gaps), `FIRST`/`LAST` return the actual first/last index (which differ from 1/COUNT once a collection is sparse), and a nested table can become sparse after `DELETE`.",
    "id": 137
  }
];

// --- App Logic ---

const BANK = window.QUIZ_QUESTIONS || [];

let questions = [];
let currentIndex = 0;
let selectedCount = 20;
let selectedMode = 'mixed';
let answerHistory = [];
let totalPoints = 0;
let streak = 0;
let bestStreak = 0;

const SESSION_KEY = 'plsql_quiz_session';

function saveSession() {
  const state = {
    questions, currentIndex, selectedCount, selectedMode, totalPoints, streak, bestStreak,
    answerHistory: answerHistory.map(h => ({
      q: h.q, fullyCorrect: h.fullyCorrect, points: h.points, maxPoints: h.maxPoints,
      selected: [...h.selected], correctIdx: [...h.correctIdx]
    }))
  };
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(state)); } catch (e) {}
}

function readSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!s || !s.questions || !s.questions.length) return null;
    if (s.currentIndex >= s.questions.length) return null;
    return s;
  } catch (e) { return null; }
}

function loadSession() {
  const s = readSession();
  if (!s) return false;
  questions = s.questions;
  currentIndex = s.currentIndex;
  selectedCount = s.selectedCount;
  selectedMode = s.selectedMode;
  totalPoints = s.totalPoints;
  streak = s.streak || 0;
  bestStreak = s.bestStreak || 0;
  answerHistory = (s.answerHistory || []).map(h => ({
    ...h, selected: new Set(h.selected), correctIdx: new Set(h.correctIdx)
  }));
  return true;
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
}

const SEEN_KEY = 'plsql_quiz_seen_ids';
function loadSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); }
  catch (e) { return new Set(); }
}
function saveSeen(set) {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...set])); } catch (e) {}
}

let selected = new Set();
let revealed = false;
let currentSetExplainOpen = null;
let currentToggleExplain = null;

// --- Streak ---
function updateStreak(correct) {
  if (correct) {
    streak++;
    if (streak > bestStreak) bestStreak = streak;
  } else {
    streak = 0;
  }
  const hudStreak = document.getElementById('hud-streak');
  const streakDisplay = document.getElementById('streak-display');
  if (streak >= 2) {
    hudStreak.style.display = 'flex';
    streakDisplay.textContent = streak;
    hudStreak.classList.add('hot');
    setTimeout(() => hudStreak.classList.remove('hot'), 400);
  } else {
    hudStreak.style.display = 'none';
  }
}

// --- Score popup ---
function showScorePopup(pts, correct) {
  const popup = document.createElement('div');
  popup.className = 'score-popup ' + (correct ? 'correct' : 'wrong');
  popup.textContent = correct ? '+' + pts.toFixed(2) : '+' + pts.toFixed(2);
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1100);
}

// --- Helpers ---
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildHighlightedCode(code, annotations) {
  const used = [];
  const ranges = [];
  (annotations || []).forEach(an => {
    let from = 0, idx;
    while ((idx = code.indexOf(an.find, from)) !== -1) {
      const a = idx, b = idx + an.find.length;
      if (!used.some(u => !(b <= u[0] || a >= u[1]))) {
        used.push([a, b]); ranges.push({ start: a, end: b, n: an.n }); break;
      }
      from = idx + 1;
    }
  });
  ranges.sort((x, y) => x.start - y.start);
  let html = '', pos = 0;
  ranges.forEach(r => {
    if (r.start < pos) return;
    html += escapeHtml(code.slice(pos, r.start));
    html += `<mark class="hl" data-n="${r.n}"><sup class="hl-badge">${r.n}</sup>${escapeHtml(code.slice(r.start, r.end))}</mark>`;
    pos = r.end;
  });
  html += escapeHtml(code.slice(pos));
  return html;
}

function hasCodeAnnotations(q) {
  return !!(splitQuestion(q.question).code && q.annotations && q.annotations.length);
}

function formatExplain(text) {
  return escapeHtml(text).replace(/`([^`]+)`/g, '<span class="kw">$1</span>');
}

function explanationBodyHtml(q) {
  let html = '';
  if (q.explanation) html += `<div class="explain-text">${formatExplain(q.explanation)}</div>`;
  if (hasCodeAnnotations(q)) {
    html += '<div class="explain-section-label">In the code</div><ul class="note-list">';
    q.annotations.forEach(an => {
      html += `<li data-n="${an.n}"><span class="note-num">${an.n}</span><span>${formatExplain(an.note)}</span></li>`;
    });
    html += '</ul>';
  }
  if (q.walkthrough && q.walkthrough.length) {
    html += '<div class="explain-section-label">How it runs</div><ol class="walkthrough">';
    q.walkthrough.forEach((s, i) => {
      html += `<li><span class="step-num">${i + 1}</span><span>${formatExplain(s)}</span></li>`;
    });
    html += '</ol>';
  }
  if (!html) html = '<div class="explain-text" style="color:var(--text-secondary)">No explanation available yet.</div>';
  return html;
}

function codeBlockHtml(q) {
  const parts = splitQuestion(q.question);
  if (!parts.code) return '';
  const inner = hasCodeAnnotations(q)
    ? buildHighlightedCode(parts.code, q.annotations)
    : escapeHtml(parts.code);
  return `<div class="question-code"><pre>${inner}</pre></div>`;
}

function flashPair(root, n) {
  root.querySelectorAll('mark.hl, .note-list li').forEach(el => el.classList.remove('active'));
  root.querySelectorAll(`[data-n="${n}"]`).forEach(el => el.classList.add('active'));
  const li = root.querySelector(`.note-list li[data-n="${n}"]`);
  if (li) li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function wireExplainInteractions(root) {
  root.querySelectorAll('.note-list li').forEach(li => li.addEventListener('click', () => flashPair(root, li.dataset.n)));
  root.querySelectorAll('mark.hl').forEach(m => m.addEventListener('click', () => flashPair(root, m.dataset.n)));
}

function calculatePoints(correctSet, selectedSet, totalQuestions) {
  const totalCorrect = correctSet.size;
  const maxQuestionScore = 10.0 / totalQuestions;
  if (totalCorrect === 0) return selectedSet.size === 0 ? maxQuestionScore : 0;
  const valuePerCorrect = maxQuestionScore / totalCorrect;
  const penalty = maxQuestionScore * 0.2;
  let correctSel = 0, wrongSel = 0;
  selectedSet.forEach(i => { if (correctSet.has(i)) correctSel++; else wrongSel++; });
  return Math.max(0, correctSel * valuePerCorrect - wrongSel * penalty);
}

function correctIndexSet(q) {
  const s = new Set();
  q.answers.forEach((a, i) => { if (a.isCorrect) s.add(i); });
  return s;
}

const CODE_RE = /^\s*(SET\s+SERVEROUTPUT|DECLARE\b|BEGIN\b|END\b|END;|CREATE\b|CURSOR\b|SELECT\b|INSERT\b|UPDATE\b|DELETE\b|FOR\s|WHILE\b|IF\s|ELSIF\b|ELSE\b|EXCEPTION\b|OPEN\b|FETCH\b|CLOSE\b|LOOP\b|RETURN\b|DBMS_OUTPUT|RAISE\b|COMMIT\b|ROLLBACK\b|PRAGMA\b|WHEN\b|\/$|[A-Za-z_][A-Za-z0-9_]*\s*:?=|:new|:old)/;
function looksLikeCode(line) {
  if (CODE_RE.test(line)) return true;
  if (/%TYPE|%ROWTYPE|%ROWCOUNT|\|\||;\s*$/.test(line)) return true;
  return false;
}
function splitQuestion(text) {
  if (text.indexOf('\n') === -1) return { intro: text, code: '', outro: '' };
  const lines = text.split('\n');
  const mi = lines.findIndex(l => /^\s*Code:\s*$/i.test(l));
  if (mi !== -1) {
    const codeLines = lines.slice(mi + 1);
    while (codeLines.length && /^\s*$/.test(codeLines[0])) codeLines.shift();
    while (codeLines.length && /^\s*$/.test(codeLines[codeLines.length - 1])) codeLines.pop();
    return { intro: lines.slice(0, mi).join('\n').trim(), code: codeLines.join('\n'), outro: '' };
  }
  let first = -1, last = -1;
  for (let i = 0; i < lines.length; i++) {
    if (looksLikeCode(lines[i])) { if (first === -1) first = i; last = i; }
  }
  if (first === -1) return { intro: text, code: '', outro: '' };
  return {
    intro: lines.slice(0, first).join('\n').replace(/\n*\s*Code:\s*$/i, '').trim(),
    code: lines.slice(first, last + 1).join('\n'),
    outro: lines.slice(last + 1).join('\n').trim()
  };
}

function isCodeQ(q) { return !!splitQuestion(q.question).code; }

function pickFrom(pool, n, seen) {
  if (n <= 0 || pool.length === 0) return [];
  if (n > pool.length) n = pool.length;
  let fresh = pool.filter(q => !seen.has(q.id));
  const maxRepeat = Math.floor(n * 0.35);
  if (fresh.length < n - maxRepeat) {
    pool.forEach(q => seen.delete(q.id));
    fresh = pool.slice();
  }
  const stale = pool.filter(q => seen.has(q.id));
  let chosen = shuffle(fresh).slice(0, n);
  if (chosen.length < n) chosen = chosen.concat(shuffle(stale).slice(0, n - chosen.length));
  chosen.forEach(q => seen.add(q.id));
  return chosen;
}

function buildQuiz(mode, count) {
  const study = BANK.filter(q => !q.category);
  const seen = loadSeen();
  let chosen;
  if (mode === 'past') {
    const pool = BANK.filter(q => q.category === 'past_exam');
    chosen = pickFrom(pool, Math.min(count, pool.length), seen);
  } else if (mode === 'mixed') {
    chosen = pickFrom(study, Math.min(count, study.length), seen);
  } else {
    const coding = study.filter(isCodeQ);
    const theory = study.filter(q => !isCodeQ(q));
    const primary = mode === 'coding' ? coding : theory;
    const secondary = mode === 'coding' ? theory : coding;
    let nP, nS;
    if (count >= study.length) {
      nP = primary.length;
      nS = Math.round(secondary.length * 0.3);
    } else {
      nP = Math.min(Math.round(count * 0.7), primary.length);
      nS = Math.min(count - nP, secondary.length);
    }
    let need = count >= study.length ? 0 : count - (nP + nS);
    if (need > 0) { const a = Math.min(need, primary.length - nP); nP += a; need -= a; }
    if (need > 0) { const a = Math.min(need, secondary.length - nS); nS += a; }
    chosen = pickFrom(primary, nP, seen).concat(pickFrom(secondary, nS, seen));
  }
  saveSeen(seen);
  return shuffle(chosen);
}

function renderSetup() {
  document.getElementById('setup-screen').style.display = 'block';
  document.getElementById('quiz-screen').style.display = 'none';
  document.getElementById('results-screen').style.display = 'none';
  document.getElementById('custom-count-input').max = BANK.length;
  const cont = document.getElementById('continue-btn');
  const s = readSession();
  if (s) {
    cont.style.display = 'block';
    cont.textContent = `Continue Quiz \u2014 question ${s.currentIndex + 1} of ${s.questions.length}`;
  } else {
    cont.style.display = 'none';
  }
}

function continueQuiz() {
  if (!loadSession()) { renderSetup(); return; }
  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';
  document.getElementById('results-screen').style.display = 'none';
  document.getElementById('score-display').textContent = totalPoints.toFixed(2);
  renderQuestion();
}

function startQuiz() {
  let count;
  if (selectedCount === 'all') count = BANK.length;
  else if (selectedCount === 'custom') {
    count = parseInt(document.getElementById('custom-count-input').value, 10);
    if (!count || count < 1) count = 1;
  } else count = selectedCount;
  if (count > BANK.length) count = BANK.length;

  questions = buildQuiz(selectedMode, count).map(q => ({
    id: q.id, question: q.question, answers: shuffle(q.answers),
    explanation: q.explanation, annotations: q.annotations, walkthrough: q.walkthrough
  }));
  currentIndex = 0;
  answerHistory = [];
  totalPoints = 0;
  streak = 0;
  bestStreak = 0;

  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';
  document.getElementById('results-screen').style.display = 'none';
  document.getElementById('score-display').textContent = '0.00';
  document.getElementById('hud-streak').style.display = 'none';
  saveSession();
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];
  selected = new Set();
  revealed = false;
  const correctSet = correctIndexSet(q);
  const isMulti = correctSet.size > 1;

  document.getElementById('question-meta').textContent = `Question ${currentIndex + 1} of ${questions.length}  \u00b7  ID #${q.id}`;
  document.getElementById('progress-text').textContent = `${currentIndex + 1}/${questions.length}`;
  document.getElementById('progress-fill').style.width = `${(currentIndex / questions.length) * 100}%`;

  const note = document.getElementById('multi-note');
  if (isMulti) { note.style.display = 'inline-block'; note.textContent = 'Multiple Answers'; }
  else note.style.display = 'none';

  const parts = splitQuestion(q.question);
  document.getElementById('question-text').textContent = [parts.intro, parts.outro].filter(Boolean).join('\n\n');
  const codeEl = document.getElementById('question-code');
  if (parts.code) { codeEl.style.display = 'block'; codeEl.querySelector('pre').textContent = parts.code; }
  else codeEl.style.display = 'none';

  const answersEl = document.getElementById('answers');
  answersEl.innerHTML = '';
  q.answers.forEach((ans, idx) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn' + (isMulti ? ' multi' : '');
    btn.dataset.idx = idx;
    btn.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + idx)}</span><span>${escapeHtml(ans.text)}</span><span class="answer-icon"></span>`;
    btn.onclick = () => onAnswerClick(idx, isMulti);
    answersEl.appendChild(btn);
  });

  document.getElementById('qa-wrap').classList.remove('is-open');
  const whyBtn = document.getElementById('why-btn');
  whyBtn.style.display = 'none';
  whyBtn.classList.remove('is-active');
  document.getElementById('explain-window').setAttribute('aria-hidden', 'true');
  document.getElementById('explain-body').innerHTML = '';
  currentSetExplainOpen = null;
  currentToggleExplain = null;

  saveSession();
  const next = document.getElementById('next-btn');
  next.disabled = true;
  next.textContent = isMulti ? 'Check Answers' : 'Check Answer';
  next.onclick = checkAnswers;
}

function onAnswerClick(idx, isMulti) {
  if (revealed) return;
  if (isMulti) {
    if (selected.has(idx)) selected.delete(idx); else selected.add(idx);
    document.querySelectorAll('.answer-btn').forEach(btn => {
      btn.classList.toggle('selected', selected.has(parseInt(btn.dataset.idx, 10)));
    });
    document.getElementById('next-btn').disabled = selected.size === 0;
  } else {
    selected = new Set([idx]);
    document.querySelectorAll('.answer-btn').forEach(btn => {
      btn.classList.toggle('selected', selected.has(parseInt(btn.dataset.idx, 10)));
    });
    document.getElementById('next-btn').disabled = false;
  }
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

function checkAnswers() {
  if (selected.size === 0) return;
  reveal();
}

function reveal() {
  revealed = true;
  const q = questions[currentIndex];
  const correctSet = correctIndexSet(q);

  document.querySelectorAll('.answer-btn').forEach(btn => {
    const i = parseInt(btn.dataset.idx, 10);
    btn.disabled = true;
    btn.classList.remove('selected');
    const icon = btn.querySelector('.answer-icon');
    if (correctSet.has(i)) {
      btn.classList.add(selected.has(i) ? 'correct' : 'missed');
      if (selected.has(i) && icon) icon.textContent = '\u2713';
      if (!selected.has(i) && icon) icon.textContent = '\u2713';
    } else if (selected.has(i)) {
      btn.classList.add('wrong');
      if (icon) icon.textContent = '\u2717';
    }
  });

  const pts = calculatePoints(correctSet, selected, questions.length);
  totalPoints += pts;
  const maxQ = 10.0 / questions.length;
  const fullyCorrect = setsEqual(selected, correctSet);
  answerHistory.push({
    q, selected: new Set(selected), correctIdx: correctSet,
    fullyCorrect, points: pts, maxPoints: maxQ
  });

  updateStreak(fullyCorrect);
  document.getElementById('score-display').textContent = totalPoints.toFixed(2);
  showScorePopup(pts, fullyCorrect);

  const parts = splitQuestion(q.question);
  const annotated = hasCodeAnnotations(q);
  const qaWrap = document.getElementById('qa-wrap');
  const pre = document.getElementById('question-code').querySelector('pre');
  const why = document.getElementById('why-btn');
  const win = document.getElementById('explain-window');

  document.getElementById('explain-body').innerHTML = explanationBodyHtml(q);
  why.style.display = 'inline-flex';

  function setExplainOpen(open) {
    qaWrap.classList.toggle('is-open', open);
    win.setAttribute('aria-hidden', open ? 'false' : 'true');
    why.classList.toggle('is-active', open);
    if (annotated) {
      if (open) pre.innerHTML = buildHighlightedCode(parts.code, q.annotations);
      else pre.textContent = parts.code;
    }
    if (open) wireExplainInteractions(qaWrap);
  }
  const toggleExplain = () => setExplainOpen(!qaWrap.classList.contains('is-open'));
  why.onclick = toggleExplain;
  document.getElementById('explain-close').onclick = () => setExplainOpen(false);
  win.onclick = (e) => { if (e.target === win) setExplainOpen(false); };
  currentSetExplainOpen = setExplainOpen;
  currentToggleExplain = toggleExplain;

  const next = document.getElementById('next-btn');
  next.textContent = currentIndex >= questions.length - 1 ? 'See Results' : 'Next Question';
  next.disabled = false;
  next.onclick = nextQuestion;
}

function nextQuestion() {
  currentIndex++;
  saveSession();
  if (currentIndex >= questions.length) showResults();
  else renderQuestion();
}

function getGradeInfo(pct) {
  if (pct >= 95) return { grade: 'A+', label: 'Outstanding!', color: '#10b981' };
  if (pct >= 85) return { grade: 'A', label: 'Excellent!', color: '#10b981' };
  if (pct >= 75) return { grade: 'B', label: 'Good Job!', color: '#3b82f6' };
  if (pct >= 65) return { grade: 'C', label: 'Not Bad', color: '#f59e0b' };
  if (pct >= 50) return { grade: 'D', label: 'Needs Work', color: '#f97316' };
  return { grade: 'F', label: 'Keep Studying', color: '#ef4444' };
}

let resultsFilter = 'wrong';

function showResults() {
  clearSession();
  document.getElementById('quiz-screen').style.display = 'none';
  document.getElementById('results-screen').style.display = 'block';

  const pct = Math.round((totalPoints / 10.0) * 100);
  const gradeInfo = getGradeInfo(pct);
  const correctCount = answerHistory.filter(h => h.fullyCorrect).length;
  const wrongCount = answerHistory.length - correctCount;

  document.getElementById('results-grade').textContent = gradeInfo.grade;
  document.getElementById('results-grade-label').textContent = gradeInfo.label;
  document.getElementById('final-score').textContent = `${totalPoints.toFixed(2)} / 10.00`;
  document.getElementById('final-percent').textContent = `${pct}% \u2014 ${correctCount}/${questions.length} fully correct`;

  document.getElementById('stat-correct').textContent = correctCount;
  document.getElementById('stat-wrong').textContent = wrongCount;
  document.getElementById('stat-streak').textContent = bestStreak;

  resultsFilter = 'wrong';
  document.querySelectorAll('.results-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === 'wrong'));
  renderResultsList();
}

function renderResultsList() {
  const list = document.getElementById('results-list');
  list.innerHTML = '';

  const items = resultsFilter === 'wrong'
    ? answerHistory.filter(h => !h.fullyCorrect)
    : answerHistory;

  if (items.length === 0) {
    if (resultsFilter === 'wrong') {
      list.innerHTML = '<div style="text-align:center; color:var(--success); font-weight:700; padding:20px;">Perfect score! No mistakes.</div>';
    } else {
      list.innerHTML = '<div style="text-align:center; color:var(--text-secondary); padding:20px;">No questions to show.</div>';
    }
    return;
  }

  items.forEach((h, idx) => {
    const q = h.q;
    const parts = splitQuestion(q.question);
    const your = q.answers.filter((_, i) => h.selected.has(i)).map(a => a.text).join('  \u2022  ') || '(none)';
    const corr = q.answers.filter((_, i) => h.correctIdx.has(i)).map(a => a.text).join('  \u2022  ');
    const div = document.createElement('div');
    div.className = 'result-item';
    div.style.animationDelay = (idx * 0.05) + 's';

    let badgeHtml = '';
    if (!h.fullyCorrect) {
      const partialPts = h.points > 0;
      badgeHtml = partialPts
        ? '<span class="result-badge partial-badge">Partial</span>'
        : '<span class="result-badge wrong-badge">Wrong</span>';
    } else {
      badgeHtml = '<span class="result-badge" style="background:var(--success-bg);color:var(--success);">Correct</span>';
    }

    let html = `<div class="result-item-header">${badgeHtml}<span style="font-size:0.85rem;color:var(--text-secondary);">Q${answerHistory.indexOf(h) + 1}</span></div>`;
    html += `<div class="q">${escapeHtml([parts.intro, parts.outro].filter(Boolean).join('\n'))}</div>`;
    html += codeBlockHtml(q);
    if (!h.fullyCorrect) {
      html += `<div class="your">Your answer: ${escapeHtml(your)}</div>`;
      html += `<div class="correct-ans">Correct answer${h.correctIdx.size > 1 ? 's' : ''}: ${escapeHtml(corr)}</div>`;
    }
    html += `<div class="explain-panel" style="margin-top:12px;">${explanationBodyHtml(q)}</div>`;
    div.innerHTML = html;
    list.appendChild(div);
    wireExplainInteractions(div);
  });
}

// --- Event Listeners ---
document.querySelectorAll('.count-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const c = btn.dataset.count;
    if (c === 'custom') {
      selectedCount = 'custom';
      document.getElementById('custom-input-wrapper').classList.add('visible');
      document.getElementById('custom-count-input').focus();
    } else {
      selectedCount = (c === 'all') ? 'all' : parseInt(c, 10);
      document.getElementById('custom-input-wrapper').classList.remove('visible');
    }
  });
});

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedMode = btn.dataset.mode;
  });
});

document.querySelectorAll('.results-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    resultsFilter = tab.dataset.filter;
    renderResultsList();
  });
});

document.querySelector('.count-btn[data-count="20"]').classList.add('active');
document.getElementById('start-btn').addEventListener('click', () => startQuiz());
document.getElementById('continue-btn').addEventListener('click', continueQuiz);
document.getElementById('restart-btn').addEventListener('click', renderSetup);
document.getElementById('custom-count-input').addEventListener('keypress', e => { if (e.key === 'Enter') startQuiz(); });

// Theme system: color picker + dark mode toggle
(function() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const picker = document.getElementById('color-picker');

  function isDark() { return root.getAttribute('data-theme') === 'dark'; }

  function updateModeIcon() {
    toggle.textContent = isDark() ? 'Light' : 'Dark';
  }

  function updateActiveSwatch() {
    const current = root.getAttribute('data-color') || 'slate-deep';
    picker.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === current);
    });
  }

  toggle.addEventListener('click', () => {
    if (isDark()) root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', 'dark');
    try { localStorage.setItem('plsql_quiz_mode', isDark() ? 'dark' : 'light'); } catch (e) {}
    updateModeIcon();
  });

  picker.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    const color = swatch.dataset.color;
    if (color === 'slate') root.removeAttribute('data-color');
    else root.setAttribute('data-color', color);
    try { localStorage.setItem('plsql_quiz_color', color); } catch (e) {}
    updateActiveSwatch();
  });

  updateModeIcon();
  updateActiveSwatch();
})();

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  const quizVisible = document.getElementById('quiz-screen').style.display !== 'none';

  if (e.key === 'Escape' && currentSetExplainOpen) {
    currentSetExplainOpen(false);
    return;
  }

  if (!quizVisible) {
    if (e.key === 'Enter') { e.preventDefault(); startQuiz(); }
    return;
  }

  if ((e.key === 'w' || e.key === 'W') && revealed && currentToggleExplain) {
    e.preventDefault();
    currentToggleExplain();
    return;
  }

  if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.explain-inner')) {
    e.preventDefault();
    if (!revealed) {
      if (selected.size > 0) { reveal(); }
    } else {
      nextQuestion();
    }
    return;
  }
});

renderSetup();

