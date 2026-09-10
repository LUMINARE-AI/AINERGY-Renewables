from enum import Enum


class ModuleType(str, Enum):
    """PV module sourcing category — drives module Rs/Wp rate and default DC:AC ratio."""

    DCR = "dcr"  # Domestic Content Requirement (ALMM-listed Indian cells) — eligible for govt/PSU tenders
    NON_DCR = "non_dcr"


class MountingType(str, Enum):
    FIXED = "fixed"
    TRACKER = "tracker"  # single-axis tracker


class InverterType(str, Enum):
    STRING = "string"
    CENTRAL = "central"


class ProjectScope(str, Enum):
    """Cumulative scope of supply — each tier includes everything in the tiers above it."""

    MODULES_ONLY = "modules_only"
    MODULES_MOUNTING = "modules_mounting"
    MODULES_MOUNTING_INVERTER = "modules_mounting_inverter"
    BOS_EXCL_EVACUATION = "bos_excl_evacuation"
    FULL_EPC_TURNKEY = "full_epc_turnkey"  # + evacuation infra; land priced separately via include_land


class SiteState(str, Enum):
    TAMIL_NADU = "tamil_nadu"
    KARNATAKA = "karnataka"
    ANDHRA_PRADESH = "andhra_pradesh"
    TELANGANA = "telangana"
    GUJARAT = "gujarat"
    MAHARASHTRA = "maharashtra"
    MADHYA_PRADESH = "madhya_pradesh"
    RAJASTHAN = "rajasthan"
    UTTAR_PRADESH = "uttar_pradesh"
    OTHER = "other"
