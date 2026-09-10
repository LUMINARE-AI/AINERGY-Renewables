from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_estimate_endpoint_happy_path():
    resp = client.post(
        "/api/v1/estimate",
        json={
            "capacity_ac_mw": 15,
            "module_type": "dcr",
            "mounting_type": "fixed",
            "inverter_type": "string",
            "project_scope": "full_epc_turnkey",
            "state": "tamil_nadu",
            "evacuation_line_km": 5,
            "include_land": False,
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["capacity_ac_mw"] == 15
    assert body["total_ex_gst_inr"]["low"] < body["total_ex_gst_inr"]["base"] < body["total_ex_gst_inr"]["high"]
    assert len(body["line_items"]) == 12


def test_estimate_endpoint_rejects_invalid_capacity():
    resp = client.post("/api/v1/estimate", json={"capacity_ac_mw": -5})
    assert resp.status_code == 422


def test_states_and_scopes_config_endpoints():
    states = client.get("/api/v1/config/states")
    assert states.status_code == 200
    assert len(states.json()) == 10

    scopes = client.get("/api/v1/config/scopes")
    assert scopes.status_code == 200
    assert len(scopes.json()) == 5


def test_rate_card_endpoint_exposes_defaults():
    resp = client.get("/api/v1/config/rate-card")
    assert resp.status_code == 200
    body = resp.json()
    assert "modules" in body
    assert body["gst"]["goods_rate"] == 0.12
