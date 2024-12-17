export interface Operator {
  id: string;
  name: string;
  description: string;
  canUseGeneralPotentialItem: boolean;
  canUseActivityPotentialItem: boolean;
  potentialItemId: string;
  // activityPotentialItemId: null,
  classicPotentialItemId: string;
  nationId: string;
  // groupId: null,
  // teamId: null,
  displayNumber: string;
  appellation: string;
  position: string;
  tagList: string[];
  itemUsage: string;
  itemDesc: string;
  itemObtainApproach: string;
  isNotObtainable: boolean;
  isSpChar: boolean;
  maxPotentialLevel: number;
  rarity: number;
  profession: string;
  subProfessionId: string;
  // trait: null,
  phases: Array<{
    characterPrefabKey: string;
    rangeId: string;
    maxLevel: number;
    attributesKeyFrames: {
      level: number;
      data: {
        maxHp: number;
        atk: number;
        def: number;
        magicResistance: number;
        cost: number;
        blockCnt: number;
        moveSpeed: number;
        attackSpeed: number;
        baseAttackTime: number;
        respawnTime: number;
        hpRecoveryPerSec: number;
        spRecoveryPerSec: number;
        maxDeployCount: number;
        maxDeckStackCnt: number;
        tauntLevel: number;
        massLevel: number;
        baseForceLevel: number;
        stunImmune: boolean;
        silenceImmune: boolean;
        sleepImmune: boolean;
        frozenImmune: boolean;
        levitateImmune: boolean;
        disarmedCombatImmune: boolean;
        fearedImmune: boolean;
      };
    };
    evolveCost: null | Array<{
      id: string;
      count: number;
      type: string;
    }>;
  }>;
  skills: Array<{
    skillId: string;
    // overridePrefabKey: null;
    // overrideTokenKey: null;
    levelUpCostCond: Array<{
      unlockCond: {
        phase: number;
        level: number;
      };
      lvlUpTime: number;
      levelUpCost: [
        {
          id: number;
          count: number;
          type: string;
        },
      ];
    }>;
    unlockCond: {
      phase: number;
      level: number;
    };
  }>;
  talents: Array<{
    candidates: Array<{
      unlockCondition: {
        phase: number;
        level: number;
      };
      requiredPotentialRank: number;
      prefabKey: number;
      name: string;
      description: string;
      // rangeId: null,
      blackboard: Array<{
        key: string;
        value: number;
      }>;
      isHideTalent: boolean;
    }>;
  }>;
  potentialRanks: Array<{
    type: number;
    description: string;
    buff: {
      attributes: {
        // abnormalFlags: null,
        // abnormalImmunes: null,
        // abnormalAntis: null,
        // abnormalCombos: null,
        // abnormalComboImmunes: null,
        attributeModifiers: Array<{
          attributeType: number;
          formulaItem: number;
          value: number;
          loadFromBlackboard: boolean;
          fetchBaseValueFromSourceEntity: boolean;
        }>;
      };
    };
    // equivalentCost: null
  }>;
  favorKeyFrames: Array<{
    level: number;
    data: {
      maxHp: number;
      atk: number;
      def: number;
      magicResistance: number;
      cost: number;
      blockCnt: number;
      moveSpeed: number;
      attackSpeed: number;
      baseAttackTime: number;
      respawnTime: number;
      hpRecoveryPerSec: number;
      spRecoveryPerSec: number;
      maxDeployCount: number;
      maxDeckStackCnt: number;
      tauntLevel: number;
      massLevel: number;
      baseForceLevel: number;
      stunImmune: boolean;
      silenceImmune: boolean;
      sleepImmune: boolean;
      frozenImmune: boolean;
      levitateImmune: boolean;
      disarmedCombatImmune: boolean;
      fearedImmune: boolean;
    };
  }>;
  allSkillLvlup: Array<{
    unlockCond: {
      phase: number;
      level: number;
    };
    lvlUpCost: [
      {
        id: number;
        count: number;
        type: string;
      },
    ];
  }>;
  modules: Array<string>;
}

export interface Module {
  uniEquipId: string;
  uniEquipName: string;
  uniEquipIcon: string;
  uniEquipDesc: string;
  typeIcon: string;
  typeName1: string;
  typeName2: string | null;
  equipShiningColor: string;
  showEvolvePhase: number;
  unlockEvolvePhase: number;
  charId: string;
  // tmplId: string;
  showLevel: number;
  unlockLevel: number;
  missionList: string[];
  unlockFavors: null | {
    [key: string]: number;
  };
  itemCost: null | {
    [key: string]: [
      {
        id: string;
        count: number;
        type: string;
      },
    ];
  };
  type: string;
  uniEquipGetTime: number;
  charEquipOrder: number;
  hasUnlockMission: boolean;
  isSpecialEquip: boolean;
}

export interface Skill {
  skillId: string;
  // iconId: null;
  hidden: boolean;
  levels: Array<{
    name: string;
    rangeId: string;
    description: string;
    skillType: number;
    durationType: number;
    spData: {
      spType: number;
      levelUpCost: null;
      maxChargeTime: number;
      spCost: number;
      initSp: number;
      increment: number;
    };
    prefabId: string;
    duration: number;
    blackboard: Array<{
      key: string;
      value: number;
    }>;
  }>;
}

export interface Item {
  itemId: string;
  name: string;
  description: string;
  rarity: string;
  iconId: string;
  // overrideBkg: null,
  // stackIconId: null,
  sortId: number;
  usage: string;
  obtainApproach: string;
  hideInItemGet: boolean;
  classifyType: string;
  itemType: string;
  stageDropList: Array<{
    stageId: string;
    occPer: string;
  }>;
  buildingProductList: Array<{
    roomType: string;
    formulaId: string;
  }>;
  // voucherRelateList: null
}
