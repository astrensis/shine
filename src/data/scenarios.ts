import type { Scenario } from '../types/game'

// =====================================================================
// ① 人コワ・サスペンス系:『真夜中のドアスコープ』
// =====================================================================
const doorscopeScenario: Scenario = {
  id: 'doorscope',
  title: '真夜中のドアスコープ',
  description: '後輩・アオイからの深夜SOS',
  character: {
    id: 'aoi',
    name: 'アオイ',
    avatarEmoji: '🌙',
    avatarColor: '#f472b6',
  },
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      messages: [
        {
          id: 's1',
          sender: 'them',
          text: '先輩、起きてますか？',
          delayMs: 1200,
          sound: 'receive',
        },
        {
          id: 's2',
          sender: 'them',
          text: 'さっきから誰かが鍵穴をガチャガチャ触ってて…怖いです',
          delayMs: 1800,
          sound: 'receive',
          effect: 'shake',
        },
        {
          id: 's3',
          sender: 'them',
          text: 'インターホンも鳴らさずに、ずっと…',
          delayMs: 2000,
          sound: 'receive',
        },
        {
          id: 's4',
          sender: 'system',
          text: 'アオイの部屋のドアノブが、静かに揺れている',
          delayMs: 1500,
        },
      ],
      choices: [
        { id: 'c1a', label: '電気を消して、居留守を使え', nextNodeId: 'silence_path' },
        { id: 'c1b', label: '「誰ですか！」と大声で声をかけろ', nextNodeId: 'voice_bad' },
      ],
    },

    // ---- Bルート：声を出す → 即バッドエンドへの布石 ----
    voice_bad: {
      id: 'voice_bad',
      messages: [
        {
          id: 'vb1',
          sender: 'me',
          text: '「誰ですか！」って大声で言ってみて！',
          delayMs: 300,
          sound: 'send',
        },
        {
          id: 'vb2',
          sender: 'them',
          text: '……言いました……ガチャガチャ、止まりました',
          delayMs: 2200,
          sound: 'receive',
        },
        {
          id: 'vb3',
          sender: 'them',
          text: 'でも今、チェーンの金属音が…',
          delayMs: 1800,
          sound: 'receive',
          effect: 'shake',
        },
        {
          id: 'vb4',
          sender: 'system',
          text: 'ガチャン、と何かが切断される音',
          delayMs: 1400,
          sound: 'noise',
        },
        {
          id: 'vb5',
          sender: 'them',
          text: 'せんぱ',
          delayMs: 900,
          sound: 'receive',
          effect: 'flash-red',
          glitchText: true,
        },
        {
          id: 'vb6',
          sender: 'system',
          text: '既読　20:14',
          delayMs: 1000,
        },
        {
          id: 'vb7',
          sender: 'system',
          text: 'それ以降、アオイからの返信はない',
          delayMs: 1800,
        },
      ],
      autoNextNodeId: 'ending_voice_bad',
      autoNextDelayMs: 2200,
    },
    ending_voice_bad: {
      id: 'ending_voice_bad',
      messages: [],
      ending: {
        type: 'bad',
        title: '通信途絶',
        description:
          '声を出したことで、侵入者はアオイの存在を確信した。チェーンは切断され、部屋のドアが開けられる音を最後に、アオイの反応は途絶えた。',
      },
    },

    // ---- Aルート：沈黙 → ドアスコープ確認 → 最終分岐 ----
    silence_path: {
      id: 'silence_path',
      messages: [
        {
          id: 'sp1',
          sender: 'me',
          text: '電気消して、絶対音立てないで。じっとしてて',
          delayMs: 300,
          sound: 'send',
        },
        {
          id: 'sp2',
          sender: 'them',
          text: '……消しました。真っ暗です',
          delayMs: 2200,
          sound: 'receive',
        },
        {
          id: 'sp3',
          sender: 'them',
          text: 'ガチャガチャ…止まった、気がします',
          delayMs: 2000,
          sound: 'receive',
        },
        {
          id: 'sp4',
          sender: 'them',
          text: 'ドアスコープ、そっと覗いてみます',
          delayMs: 1800,
          sound: 'receive',
        },
        {
          id: 'sp5',
          sender: 'them',
          text: '……誰もいません。廊下、誰もいない',
          delayMs: 2200,
          sound: 'receive',
        },
        {
          id: 'sp6',
          sender: 'them',
          text: 'あ、でも郵便受けの隙間から…',
          delayMs: 1800,
          sound: 'receive',
        },
        {
          id: 'sp7',
          sender: 'them',
          text: '……誰かがこっちを見上げてます',
          delayMs: 2000,
          sound: 'receive',
          effect: 'flash-red',
        },
        {
          id: 'sp8',
          sender: 'system',
          text: '',
          image: { kind: 'eyes', caption: '郵便受けの隙間から見上げる目' },
          delayMs: 1000,
          effect: 'shake',
        },
      ],
      choices: [
        {
          id: 'c2a',
          label: 'カギを二重ロックし、音を立てずに110番通報させる',
          nextNodeId: 'survive_route',
        },
        {
          id: 'c2b',
          label: '怖くて我慢できず、ドアを開けて確認させる',
          nextNodeId: 'open_door_bad',
        },
      ],
    },

    survive_route: {
      id: 'survive_route',
      messages: [
        {
          id: 'sv1',
          sender: 'me',
          text: 'ドア絶対開けないで。鍵を二重にかけて、音を立てずに110番して',
          delayMs: 300,
          sound: 'send',
        },
        {
          id: 'sv2',
          sender: 'them',
          text: '……二重ロックしました。今、小声で警察に電話してます',
          delayMs: 2500,
          sound: 'receive',
        },
        {
          id: 'sv3',
          sender: 'system',
          text: '遠くからパトカーのサイレンが近づいてくる',
          delayMs: 2200,
        },
        {
          id: 'sv4',
          sender: 'them',
          text: '警察が来てくれました…！郵便受けの前で、不審な男が確保されたそうです',
          delayMs: 2500,
          sound: 'receive',
        },
        {
          id: 'sv5',
          sender: 'them',
          text: '先輩のおかげです。ありがとうございました…',
          delayMs: 2000,
          sound: 'receive',
        },
      ],
      autoNextNodeId: 'ending_survive',
      autoNextDelayMs: 1800,
    },
    ending_survive: {
      id: 'ending_survive',
      messages: [],
      ending: {
        type: 'success',
        title: '救出成功',
        description:
          '冷静な指示で、アオイは声を上げず不審者を刺激しなかった。二重ロックと通報が功を奏し、不審者は警察に確保された。',
      },
    },

    open_door_bad: {
      id: 'open_door_bad',
      messages: [
        {
          id: 'ob1',
          sender: 'them',
          text: 'もう限界です…確認してきます',
          delayMs: 1500,
          sound: 'receive',
        },
        {
          id: 'ob2',
          sender: 'me',
          text: 'だめ！開けちゃだめ！',
          delayMs: 300,
          sound: 'send',
        },
        {
          id: 'ob3',
          sender: 'system',
          text: 'ガチャッ……ドアチェーンが外される音',
          delayMs: 1800,
          effect: 'shake-hard',
          sound: 'noise',
        },
        {
          id: 'ob4',
          sender: 'them',
          text: 'きゃ',
          delayMs: 1000,
          effect: 'flash-red',
          glitchText: true,
        },
        {
          id: 'ob5',
          sender: 'system',
          text: 'それ以降、アオイからの返信はない',
          delayMs: 2000,
        },
      ],
      autoNextNodeId: 'ending_open_door_bad',
      autoNextDelayMs: 2200,
    },
    ending_open_door_bad: {
      id: 'ending_open_door_bad',
      messages: [],
      ending: {
        type: 'bad',
        title: '通信途絶',
        description:
          '恐怖に耐えきれず自ら確認しにいったアオイ。ドアを開けた瞬間、侵入を許してしまった。',
      },
    },
  },
}

// =====================================================================
// ② 現代怪異・オカルト系:『霧の旧トンネル』
// =====================================================================
const tunnelScenario: Scenario = {
  id: 'tunnel',
  title: '霧の旧トンネル',
  description: '悪友・タクヤからの深夜SOS',
  character: {
    id: 'takuya',
    name: 'タクヤ',
    avatarEmoji: '🚗',
    avatarColor: '#38bdf8',
  },
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      messages: [
        { id: 't1', sender: 'them', text: '車、動かねえ', delayMs: 1200, sound: 'receive' },
        {
          id: 't2',
          sender: 'them',
          text: '旧トンネルの前でエンストした。霧で前がほぼ見えん',
          delayMs: 1800,
          sound: 'receive',
        },
        {
          id: 't3',
          sender: 'them',
          text: 'てか、何か…立ってる気がする',
          delayMs: 2200,
          sound: 'receive',
          effect: 'shake',
        },
        {
          id: 't4',
          sender: 'system',
          text: '',
          image: { kind: 'tunnel', caption: '霧に沈む封鎖されたトンネル' },
          delayMs: 1200,
        },
      ],
      choices: [
        { id: 'tc1a', label: 'ライトを全部消して、息を潜めろ', nextNodeId: 'survive_path' },
        { id: 'tc1b', label: 'パニックになって外に逃げろ', nextNodeId: 'run_bad' },
      ],
    },

    run_bad: {
      id: 'run_bad',
      messages: [
        {
          id: 'rb1',
          sender: 'them',
          text: 'む、無理だ！外に出る！！',
          delayMs: 1200,
          sound: 'receive',
        },
        {
          id: 'rb2',
          sender: 'me',
          text: '待て！車から出るな！',
          delayMs: 300,
          sound: 'send',
        },
        {
          id: 'rb3',
          sender: 'them',
          text: 'だれか$#%る',
          delayMs: 1500,
          sound: 'receive',
          glitchText: true,
          effect: 'shake-hard',
        },
        {
          id: 'rb4',
          sender: 'them',
          text: 'うしろみ$るな',
          delayMs: 1200,
          sound: 'receive',
          glitchText: true,
          effect: 'shake-hard',
        },
        {
          id: 'rb5',
          sender: 'system',
          text: '通話が強制切断されました',
          delayMs: 1600,
          sound: 'callEnd',
          effect: 'flash-red',
        },
      ],
      autoNextNodeId: 'ending_run_bad',
      autoNextDelayMs: 2200,
    },
    ending_run_bad: {
      id: 'ending_run_bad',
      messages: [],
      ending: {
        type: 'bad',
        title: '通信途絶',
        description:
          'パニックで車外へ飛び出したタクヤ。霧の中に消えていく足音を最後に、連絡は途絶えた。',
      },
    },

    survive_path: {
      id: 'survive_path',
      messages: [
        {
          id: 'sp1',
          sender: 'me',
          text: 'ライト全部消して。声も出すな。息を潜めてじっとしてろ',
          delayMs: 300,
          sound: 'send',
        },
        {
          id: 'sp2',
          sender: 'them',
          text: '……消した……真っ暗だ',
          delayMs: 2000,
          sound: 'receive',
        },
        {
          id: 'sp3',
          sender: 'them',
          text: 'なにか$###てくる',
          delayMs: 1800,
          sound: 'receive',
          glitchText: true,
          effect: 'shake',
        },
        {
          id: 'sp4',
          sender: 'system',
          text: 'トンネルの奥から、濡れた白い服の女がボンネットに向かって歩いてくる',
          delayMs: 2200,
          effect: 'shake-hard',
        },
      ],
      choices: [
        {
          id: 'tc2a',
          label: 'そのまま動かず、女が通り過ぎるのを待たせる',
          nextNodeId: 'ending_survive',
        },
        {
          id: 'tc2b',
          label: '我慢できずクラクションを鳴らさせる',
          nextNodeId: 'horn_bad',
        },
      ],
    },

    ending_survive: {
      id: 'ending_survive',
      messages: [
        {
          id: 'es1',
          sender: 'them',
          text: '……通り、過ぎた……',
          delayMs: 2500,
          sound: 'receive',
        },
        {
          id: 'es2',
          sender: 'system',
          text: 'エンジンが独りでに再始動する',
          delayMs: 2000,
        },
        {
          id: 'es3',
          sender: 'them',
          text: 'エンジンかかった！！今すぐ引き返す！',
          delayMs: 1800,
          sound: 'receive',
        },
      ],
      autoNextNodeId: 'ending_survive_final',
      autoNextDelayMs: 1800,
    },
    ending_survive_final: {
      id: 'ending_survive_final',
      messages: [],
      ending: {
        type: 'success',
        title: '救出成功',
        description:
          'ライトを消し、物音一つ立てずに耐え抜いたタクヤ。女がすれ違った瞬間、エンジンが再始動し、無事にトンネルを脱出した。',
      },
    },

    horn_bad: {
      id: 'horn_bad',
      messages: [
        {
          id: 'hb1',
          sender: 'them',
          text: 'む、無理だ！クラクション鳴らす！！',
          delayMs: 1200,
          sound: 'receive',
        },
        {
          id: 'hb2',
          sender: 'system',
          text: 'パアアアアアアン',
          delayMs: 800,
          sound: 'noise',
          effect: 'shake-hard',
        },
        {
          id: 'hb3',
          sender: 'system',
          text: '',
          image: { kind: 'handprints', caption: '窓ガラスに無数の手形' },
          delayMs: 1500,
          effect: 'flash-red',
        },
        {
          id: 'hb4',
          sender: 'them',
          text: 'いやだ$$$ あけ##',
          delayMs: 1200,
          glitchText: true,
        },
        {
          id: 'hb5',
          sender: 'system',
          text: '通話が強制切断されました',
          delayMs: 1500,
          sound: 'callEnd',
        },
      ],
      autoNextNodeId: 'ending_horn_bad',
      autoNextDelayMs: 2200,
    },
    ending_horn_bad: {
      id: 'ending_horn_bad',
      messages: [],
      ending: {
        type: 'bad',
        title: '通信途絶',
        description:
          'クラクションの音に反応し、無数の手形が車を取り囲んだ。それを最後に、タクヤの反応は途絶えた。',
      },
    },
  },
}

// =====================================================================
// ③ 極限密室・パニック系:『深夜ワンオペの閉店後』
// =====================================================================
const nightShiftScenario: Scenario = {
  id: 'nightshift',
  title: '深夜ワンオペの閉店後',
  description: 'バイト同僚・リョウからの深夜SOS',
  character: {
    id: 'ryo',
    name: 'リョウ',
    avatarEmoji: '🏪',
    avatarColor: '#facc15',
  },
  startNodeId: 'start',
  nodes: {
    start: {
      id: 'start',
      messages: [
        {
          id: 'n1',
          sender: 'them',
          text: '戸締まり終わったはずなのに、裏の通路から足音がする',
          delayMs: 1200,
          sound: 'receive',
        },
        {
          id: 'n2',
          sender: 'them',
          text: '防犯カメラ見たら、客用トイレのドアが勝手に開いてる…',
          delayMs: 2000,
          sound: 'receive',
          effect: 'shake',
        },
        {
          id: 'n3',
          sender: 'system',
          text: '',
          image: { kind: 'cctv', caption: '防犯カメラ：客用トイレ前の映像' },
          delayMs: 1200,
        },
        {
          id: 'n4',
          sender: 'them',
          text: '事務所に鍵かけて閉じこもってます…誰かいるっぽい',
          delayMs: 2000,
          sound: 'receive',
        },
        {
          id: 'n5',
          sender: 'system',
          text: '事務所のドアノブが、外からゆっくりと下げられる',
          delayMs: 1800,
          effect: 'shake-hard',
        },
      ],
      choices: [
        {
          id: 'nc1a',
          label: '非常警報ベルを鳴らして、非常口から外へ走らせろ',
          nextNodeId: 'alarm_path',
        },
        {
          id: 'nc1b',
          label: 'ロッカーに隠れて息を潜めさせろ',
          nextNodeId: 'locker_bad',
        },
      ],
    },

    locker_bad: {
      id: 'locker_bad',
      messages: [
        {
          id: 'lb1',
          sender: 'them',
          text: 'ロッカーの中に隠れました…音立てないようにします',
          delayMs: 2000,
          sound: 'receive',
        },
        {
          id: 'lb2',
          sender: 'system',
          text: '事務所のドアが開く音',
          delayMs: 1800,
          effect: 'shake',
        },
        {
          id: 'lb3',
          sender: 'them',
          text: '誰か…ロッカーに近づいてきて',
          delayMs: 1800,
          sound: 'receive',
          effect: 'shake',
        },
        {
          id: 'lb4',
          sender: 'system',
          text: 'ガチャン。ロッカーの外から南京錠がかけられる音',
          delayMs: 1800,
          sound: 'noise',
        },
        {
          id: 'lb5',
          sender: 'them',
          text: '閉じ込められた…出して……',
          delayMs: 1500,
          glitchText: true,
        },
        {
          id: 'lb6',
          sender: 'system',
          text: '火災報知器が鳴り響く',
          delayMs: 1500,
          sound: 'alarm',
          effect: 'flash-red',
        },
      ],
      autoNextNodeId: 'ending_locker_bad',
      autoNextDelayMs: 2200,
    },
    ending_locker_bad: {
      id: 'ending_locker_bad',
      messages: [],
      ending: {
        type: 'bad',
        title: '通信途絶',
        description:
          '隠れることを選んだリョウ。しかしロッカーは外から南京錠で封じられ、鳴り響く火災報知器の中、連絡は途絶えた。',
      },
    },

    alarm_path: {
      id: 'alarm_path',
      messages: [
        {
          id: 'ap1',
          sender: 'me',
          text: '非常ベル鳴らして！怯んだ隙に非常口から外に走れ！',
          delayMs: 300,
          sound: 'send',
        },
        {
          id: 'ap2',
          sender: 'them',
          text: 'べ、ベル鳴らします…！',
          delayMs: 1500,
          sound: 'receive',
        },
        {
          id: 'ap3',
          sender: 'system',
          text: 'けたたましい警報音が店内に響き渡る',
          delayMs: 1200,
          sound: 'alarm',
          effect: 'shake-hard',
        },
        {
          id: 'ap4',
          sender: 'them',
          text: '今です、走ります！！',
          delayMs: 1500,
          sound: 'receive',
        },
        {
          id: 'ap5',
          sender: 'system',
          text: '非常口のドアが開く音。外の空気が流れ込む',
          delayMs: 1800,
        },
      ],
      choices: [
        {
          id: 'nc2a',
          label: 'そのまま道路まで全力で走らせる',
          nextNodeId: 'ending_survive',
        },
        {
          id: 'nc2b',
          label: '一度立ち止まって店内を振り返らせる',
          nextNodeId: 'lookback_bad',
        },
      ],
    },

    ending_survive: {
      id: 'ending_survive',
      messages: [
        {
          id: 'esv1',
          sender: 'them',
          text: '道路に出ました…！人が、いる…！助かった…',
          delayMs: 2200,
          sound: 'receive',
        },
        {
          id: 'esv2',
          sender: 'them',
          text: '通報します。ありがとう、マジで',
          delayMs: 1800,
          sound: 'receive',
        },
      ],
      autoNextNodeId: 'ending_survive_final',
      autoNextDelayMs: 1800,
    },
    ending_survive_final: {
      id: 'ending_survive_final',
      messages: [],
      ending: {
        type: 'success',
        title: '救出成功',
        description:
          '警報ベルで相手が怯んだ隙に、リョウは非常口から一気に外へ。振り返らず道路まで走り抜き、無事に脱出した。',
      },
    },

    lookback_bad: {
      id: 'lookback_bad',
      messages: [
        {
          id: 'lkb1',
          sender: 'them',
          text: '……あれ、何もいない？振り返ってみます',
          delayMs: 1800,
          sound: 'receive',
        },
        {
          id: 'lkb2',
          sender: 'me',
          text: '止まるな！！振り返らず走れ！！',
          delayMs: 300,
          sound: 'send',
        },
        {
          id: 'lkb3',
          sender: 'system',
          text: '警報音の向こうから、何かがこちらに向かって走ってくる足音',
          delayMs: 1800,
          effect: 'shake-hard',
          sound: 'noise',
        },
        {
          id: 'lkb4',
          sender: 'them',
          text: 'ひ',
          delayMs: 1000,
          glitchText: true,
          effect: 'flash-red',
        },
        {
          id: 'lkb5',
          sender: 'system',
          text: 'それ以降、リョウからの返信はない',
          delayMs: 2000,
        },
      ],
      autoNextNodeId: 'ending_lookback_bad',
      autoNextDelayMs: 2200,
    },
    ending_lookback_bad: {
      id: 'ending_lookback_bad',
      messages: [],
      ending: {
        type: 'bad',
        title: '通信途絶',
        description:
          '脱出まであと一歩のところで足を止め、振り返ってしまったリョウ。警報の中、連絡は途絶えた。',
      },
    },
  },
}

export const scenarios: Scenario[] = [
  doorscopeScenario,
  tunnelScenario,
  nightShiftScenario,
]

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id)
}
