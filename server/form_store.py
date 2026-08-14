import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parent / "data" / "submissions.json"

FIELD_MESSAGES = {
    "name": "请填写姓名",
    "phone": "请填写电话",
    "address": "请填写住址",
    "occupation": "请填写职业",
    "hobby": "请填写爱好",
}

PHONE_PATTERN = re.compile(r"^1[3-9]\d{9}$")


def validate_submission(payload):
    payload = payload or {}
    errors = {}

    for field, message in FIELD_MESSAGES.items():
        if not str(payload.get(field) or "").strip():
            errors[field] = message

    phone = str(payload.get("phone") or "").strip()
    if "phone" not in errors and not PHONE_PATTERN.match(phone):
        errors["phone"] = "请填写有效电话"

    return errors


class FormStore:
    def __init__(self, path):
        self.path = Path(path)

    def _read(self):
        if not self.path.exists():
            return []
        text = self.path.read_text(encoding="utf-8").strip()
        if not text:
            return []
        return json.loads(text)

    def list_all(self):
        return self._read()

    def append(self, payload):
        items = self._read()
        item = {
            "id": str(uuid.uuid4()),
            "name": str(payload["name"]).strip(),
            "phone": str(payload["phone"]).strip(),
            "address": str(payload["address"]).strip(),
            "occupation": str(payload["occupation"]).strip(),
            "hobby": str(payload["hobby"]).strip(),
            "submitted_at": datetime.now(timezone.utc).isoformat(),
        }
        items.append(item)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(
            json.dumps(items, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return item
