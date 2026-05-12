from pathlib import Path
import sys

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import main


async def _fake_get_redis():
    return object()


async def _fake_close_redis():
    return None


def test_health_endpoint(monkeypatch):
    monkeypatch.setattr(main, "get_redis", _fake_get_redis)
    monkeypatch.setattr(main, "close_redis", _fake_close_redis)

    with TestClient(main.app) as client:
        response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
