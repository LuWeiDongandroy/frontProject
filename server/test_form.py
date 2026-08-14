from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from form_store import FormStore, validate_submission
from main import app

VALID = {
    "name": "张三",
    "phone": "13800138000",
    "address": "上海市浦东新区",
    "occupation": "工程师",
    "hobby": "阅读",
}


def test_validate_rejects_empty_fields():
    errors = validate_submission({})
    assert errors["name"] == "请填写姓名"
    assert errors["phone"] == "请填写电话"
    assert errors["address"] == "请填写住址"
    assert errors["occupation"] == "请填写职业"
    assert errors["hobby"] == "请填写爱好"


def test_validate_rejects_invalid_phone():
    errors = validate_submission({**VALID, "phone": "123"})
    assert errors["phone"] == "请填写有效电话"


def test_validate_accepts_valid_payload():
    assert validate_submission(VALID) == {}


def test_store_appends_to_file_and_survives_reload(tmp_path):
    path = tmp_path / "submissions.json"
    first = FormStore(path)
    item = first.append(VALID)
    assert item["name"] == "张三"
    assert item["phone"] == "13800138000"
    assert item["id"]

    second = FormStore(path)
    items = second.list_all()
    assert len(items) == 1
    assert items[0]["name"] == "张三"
    assert items[0]["id"] == item["id"]


@pytest.fixture
def client(tmp_path, monkeypatch):
    import form_store
    import main

    monkeypatch.setattr(form_store, "DATA_FILE", tmp_path / "submissions.json")
    monkeypatch.setattr(main, "store", FormStore(tmp_path / "submissions.json"), raising=False)
    return TestClient(app)


def test_post_form_returns_saved_item(client):
    response = client.post("/api/form", json=VALID)
    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is True
    assert body["message"] == "提交成功"
    assert body["item"]["name"] == "张三"
    assert body["item"]["id"]


def test_get_form_lists_saved_items(client):
    client.post("/api/form", json=VALID)
    response = client.get("/api/form")
    assert response.status_code == 200
    items = response.json()["items"]
    assert len(items) == 1
    assert items[0]["name"] == "张三"


def test_post_form_rejects_invalid_payload(client):
    response = client.post("/api/form", json={**VALID, "phone": "123"})
    assert response.status_code == 422
    assert response.json()["detail"]["phone"] == "请填写有效电话"
