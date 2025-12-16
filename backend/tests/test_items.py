# backend/tests/test_items.py
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app import models
from app.db import get_db  
from app.main import app
from app.functions import get_current_user


# 1. Testowa baza – sqlite zamiast Postgresa
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)


# 3. Override dependency get_db tak, żeby używał testowej bazy
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def override_get_current_user():
    return {"id": "1","username": "tester","password": "4$oQIVGY2LSmokPaG/m6lnXA$macWl8MvCBpWJoDde6IKwWfgxD3jyTqgeQzATna4Ifk"}
        
app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)


def test_create_item():
    payload = {
        "title": "Test Movie",
        "description": "Test description",
        "year": 2024,
        "rating": 8,
        "genre": "Drama",
        "director": "Me",
    }

    response = client.post("/items", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == payload["title"]
    assert data["year"] == payload["year"]


def test_update_item():
    payload = {
        "title": "Old title",
        "description": "Old",
        "year": 2020,
        "rating": 5,
        "genre": "Comedy",
        "director": "Someone",
    }
    create_resp = client.post("/items", json=payload)
    assert create_resp.status_code == 200
    item_id = create_resp.json()["id"]

    update_payload = {
        "title": "New title",
        "description": "New desc",
        "year": 2021,
        "rating": 9,
        "genre": "Drama",
        "director": "Someone Else",
    }
    update_resp = client.put(f"/items/{item_id}", json=update_payload)
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["title"] == "New title"
    assert data["rating"] == 9


def test_delete_item():
    payload = {
        "title": "To delete",
        "description": "Temp",
        "year": 2010,
        "rating": 3,
        "genre": "Horror",
        "director": "X",
    }
    create_resp = client.post("/items", json=payload)
    assert create_resp.status_code == 200
    item_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/items/{item_id}")
    assert delete_resp.status_code == 200

    list_resp = client.get("/items")
    assert list_resp.status_code == 200
    items = list_resp.json()
    ids = [it["id"] for it in items]
    assert item_id not in ids

