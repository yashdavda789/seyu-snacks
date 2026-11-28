/**
 * The 3D product studio.
 *
 * One WebGL context serves the whole site: it renders each product to a still
 * thumbnail on load, and the same context is handed to the 360 modal when a
 * product is opened. Nothing here is a photograph - every snack is geometry.
 *
 * The look it aims for is a catalogue shot: one turned wooden bowl on a pale
 * sweep, lit from the upper left, with a real contact shadow under it. Every
 * product is presented the same way, so a grid of 48 reads as one shoot.
 *
 * To change how a snack looks, edit FOOD (its shape), TONES (its colour) or
 * SETTLE (how it piles). To change the dish, edit BOWLS.
 */
import * as THREE from 'three'

const THUMB = 512

// every bowl sits its base here, so they all share one shadow line
const GROUND = -1.21

// The camera orbits on a fixed radius. PITCH is the angle above the table it
// starts at; dragging up and down moves it between the two limits.
const CAM_DIST = 8.85
const PITCH = 0.35
const PITCH_MIN = 0.12
const PITCH_MAX = 0.86

/* ------------------------------------------------------------------ colour */

export const TONES = {
  golden: [0xd79a35, 0xc07f22, 0xe6b357, 0xaa6c15, 0xdda242, 0xc98c2b, 0xeec271, 0x9c6010],
  deep: [0xb86a18, 0xa1570f, 0xcc8828, 0x8c460a, 0xc07520, 0xaa6212, 0xd9983c, 0x7b3a07],
  pale: [0xe6c66a, 0xd8b250, 0xf2d683, 0xcaa036, 0xe0bc5e, 0xd2aa46, 0xf8e098, 0xc29634],
  green: [0x8c9a3a, 0x74822a, 0xa2b050, 0x60701e, 0x95a143, 0x7e8c32, 0xb0bc64, 0x526019],
  red: [0xc25316, 0xa8420e, 0xd46724, 0x8e3209, 0xb94a14, 0xa03c0c, 0xdd7530, 0x7c2807],
  cream: [0xe2cd9c, 0xd2bb86, 0xf0deb2, 0xc2aa76, 0xdac594, 0xcab384, 0xf6e8c0, 0xb8a068],
}

// garnish: the bits that make a bowl read as namkeen rather than cereal
const PEANUT = [0x9c3d14, 0xb04a1a, 0x8a3310]
const LEAF = [0x3f6b1e, 0x4e7d26, 0x355c18]
const SPICE = [0x3a1c06, 0x51270a, 0x2b1304]

/* ------------------------------------------------------------------- shapes */

function curveTube(seed, len, rad, wob) {
  const pts = []
  for (let i = 0; i < 6; i++) {
    const t = i / 5
    pts.push(
      new THREE.Vector3(
        (t - 0.5) * len,
        Math.sin(t * 5 + seed) * wob,
        Math.cos(t * 4.2 + seed * 1.7) * wob,
      ),
    )
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 9, rad, 5, false)
}

/** Each builder returns one of 8 variants, so a pile never looks stamped out. */
export const FOOD = {
  strand: (v) => curveTube(v + 1, 0.5 + (v % 5) * 0.11, 0.025, 0.055),
  stick: (v) => curveTube(v + 1, 0.62 + (v % 4) * 0.13, 0.052, 0.03),

  bead: (v) => {
    const g = new THREE.SphereGeometry(0.072 + (v % 4) * 0.012, 12, 10)
    g.scale(1, 0.88, 1)
    return g
  },

  bean: (v) => {
    const g = new THREE.SphereGeometry(0.082 + (v % 3) * 0.014, 12, 10)
    g.scale(1.25, 0.52, 0.92)
    return g
  },

  disc: (v) => {
    const r = 0.28 + (v % 4) * 0.045
    return new THREE.CylinderGeometry(r, r * 0.97, 0.068, 22)
  },

  diamond: (v) => {
    const s = 0.21 + (v % 4) * 0.035
    return new THREE.BoxGeometry(s, 0.07, s * 1.45)
  },

  crescent: (v) => {
    const g = new THREE.TorusGeometry(0.25 + (v % 3) * 0.04, 0.08, 10, 22, Math.PI * 1.05)
    g.scale(1, 1, 0.72)
    return g
  },

  cashew: (v) => {
    const g = new THREE.TorusGeometry(0.19 + (v % 3) * 0.028, 0.06, 10, 20, Math.PI * 1.25)
    g.scale(1, 1, 0.8)
    return g
  },

  spiral: (v) => {
    const pts = []
    const R = 0.29 + (v % 3) * 0.05
    for (let i = 0; i <= 54; i++) {
      const t = i / 54
      const a = t * 2.6 * Math.PI * 2
      const r = R * (0.16 + 0.84 * t)
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(t * 3) * 0.015, Math.sin(a) * r))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.042, 5, false)
  },

  /**
   * Bhakarwadi: a sheet of dough rolled up with filling and sliced, so the
   * cut face is a spiral and the piece is a short fat barrel. A plain
   * cylinder reads as a coin, which is what it looked like before.
   *
   * Built as a spiral strip extruded along its axis - the strip's own
   * walls become the swirl you see on both ends.
   */
  wheel: (v) => {
    const turns = 2.3 + (v % 3) * 0.35
    const R = 0.29 + (v % 4) * 0.03
    const w = 0.052 // thickness of the rolled sheet
    const steps = 76
    const pts = []

    const edge = (t, off) => {
      const a = t * turns * Math.PI * 2
      const r = R * (0.2 + 0.8 * t) + off
      return new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r)
    }

    for (let i = 0; i <= steps; i++) pts.push(edge(i / steps, w / 2))
    for (let i = steps; i >= 0; i--) pts.push(edge(i / steps, -w / 2))

    const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts), {
      depth: 0.34 + (v % 3) * 0.04,
      bevelEnabled: true,
      bevelSize: 0.018,
      bevelThickness: 0.018,
      bevelSegments: 2,
      curveSegments: 1,
    })
    g.center()
    g.rotateX(Math.PI / 2) // lay it on its side, the way it falls in a bowl
    return g
  },

  // a genuine mixture: flake, peanut, strand, lentil
  mix: (v) => {
    const m = v % 4
    let g
    if (m === 0) {
      g = new THREE.SphereGeometry(0.1, 10, 8)
      g.scale(1.5, 0.3, 1.1)
      return g
    }
    if (m === 1) {
      g = new THREE.SphereGeometry(0.08, 12, 10)
      g.scale(1.35, 0.85, 0.85)
      return g
    }
    if (m === 2) return curveTube(v + 1, 0.38, 0.027, 0.04)
    return new THREE.CylinderGeometry(0.072, 0.072, 0.04, 14)
  },
}

/** tilt = how far from flat each piece settles; count = pieces per variant */
export const SETTLE = {
  strand: { tilt: 0.66, count: 270, h: 0.76 },
  stick: { tilt: 0.5, count: 175, h: 0.72 },
  bead: { tilt: 3.14, count: 300, h: 0.64 },
  bean: { tilt: 0.55, count: 255, h: 0.6 },
  disc: { tilt: 0.42, count: 115, h: 0.64 },
  diamond: { tilt: 0.5, count: 130, h: 0.64 },
  crescent: { tilt: 0.7, count: 105, h: 0.68 },
  cashew: { tilt: 0.8, count: 140, h: 0.64 },
  spiral: { tilt: 0.34, count: 65, h: 0.56 },
  // Rolls tumble every which way, and they are bulky. `count` is per
  // variant and there are eight, so 13 here is already ~100 pieces -
  // any more and they spill out over the rim.
  wheel: { tilt: 3.14, count: 13, h: 0.46 },
  mix: { tilt: 1.0, count: 245, h: 0.74 },
}

/* --------------------------------------------------------------- materials */

/**
 * Fried food is oily, and oil is what makes it look edible. A clearcoat over
 * a mid-rough base gives that wet highlight; a fully matte material reads as
 * unfired clay, which is how this looked before.
 */
const food = (col) =>
  new THREE.MeshPhysicalMaterial({
    color: col,
    roughness: 0.5,
    metalness: 0,
    clearcoat: 0.38,
    clearcoatRoughness: 0.36,
  })

/* ----------------------------------------------------------------- ceramic */

/**
 * Glazed ceramic, the pale bowl the design uses. Almost plain on purpose -
 * the bowl is meant to disappear and let the food carry the picture. The
 * faint mottling is only there so the glaze does not read as flat plastic.
 */
let clayTex = null
function clay() {
  if (clayTex) return clayTex

  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')

  g.fillStyle = '#e9e4d9'
  g.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 190; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = 10 + Math.random() * 70
    const k = g.createRadialGradient(x, y, 1, x, y, r)
    k.addColorStop(0, Math.random() < 0.5
      ? 'rgba(166, 156, 138, 0.15)'
      : 'rgba(255, 253, 248, 0.22)')
    k.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = k
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    g.fill()
  }

  clayTex = new THREE.CanvasTexture(c)
  clayTex.colorSpace = THREE.SRGBColorSpace
  clayTex.wrapS = clayTex.wrapT = THREE.RepeatWrapping
  clayTex.anisotropy = 8
  return clayTex
}

/* ----------------------------------------------------------------- vessel */

/**
 * One bowl, for every product - the design serves all 48 in the same pale
 * ceramic, and a grid only looks like a catalogue when the dish never
 * changes. A pedestal foot, a rounded body and a thin rim.
 *
 * The profile runs from the centre of the foot, out and up the outside,
 * over the rim and back down the inside, so the wall has real thickness.
 * The base sits on GROUND, which is what puts it on the shadow line.
 */
const BOWL = [
  [0.0, -1.2], [0.5, -1.2], [0.55, -1.13], [0.6, -1.02], [0.95, -0.92],
  [1.45, -0.64], [1.86, -0.18], [2.02, 0.22], [2.06, 0.42],
  [1.92, 0.43], [1.88, 0.3], [1.7, -0.1], [1.3, -0.5], [0.8, -0.72], [0.0, -0.78],
]

const FILL = { fillY: 0.16, fillR: 1.78 }

function clayBowl(group) {
  const geo = new THREE.LatheGeometry(
    BOWL.map(([x, y]) => new THREE.Vector2(x, y)),
    96,
  )
  geo.computeVertexNormals()

  const mat = new THREE.MeshPhysicalMaterial({
    map: clay(),
    color: 0xffffff,
    roughness: 0.34,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
  })

  const bowl = new THREE.Mesh(geo, mat)
  bowl.castShadow = true
  bowl.receiveShadow = true
  group.add(bowl)

  return FILL
}

export const BOWLS = [BOWL]

/* ---------------------------------------------------------------- backdrop */

/**
 * The sweep behind the product: a pale studio wall curving into the floor,
 * with the corners dropped a little so the eye stays on the bowl.
 *
 * Baked into the render rather than left to CSS, because thumbnails are
 * flattened to JPEG, which has no alpha - a transparent canvas would come
 * out black.
 */
/**
 * What goes behind the product.
 *
 *   card - a white sweep, matching --surface, baked into the JPEG the
 *          cards show. JPEG has no alpha, so it needs a real background.
 *   none - nothing at all. The hero and the product page use this and
 *          take a PNG, so the bowl floats on the page with the name
 *          showing behind it.
 *
 * Painting a near-match and blending it with CSS does not work: a button
 * or a transform makes its own stacking context and `mix-blend-mode`
 * quietly stops applying, leaving a visible lighter rectangle.
 */
/* Flat, and exactly the page colour (--bg). It used to be a white gradient,
   which looked fine until a real photograph sat next to a render in the
   grid: the photo arrives on its own near-white and the two no longer
   match. One flat colour everywhere - renders, placeholders and photos
   put through `square.py --page` - and the grid stays even. */
const SWEEPS = {
  card: ['#F8F4EC', '#F8F4EC', '#F8F4EC'],
}

const sweepCache = new Map()

function backdrop(which = 'card') {
  if (which === 'none') return null
  if (sweepCache.has(which)) return sweepCache.get(which)
  const [top, mid, foot] = SWEEPS[which] ?? SWEEPS.card

  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')

  const sweep = g.createLinearGradient(0, 0, 0, 512)
  sweep.addColorStop(0, top)
  sweep.addColorStop(0.55, mid)
  sweep.addColorStop(1, foot)
  g.fillStyle = sweep
  g.fillRect(0, 0, 512, 512)

  // the faintest pool of light where the product stands
  const pool = g.createRadialGradient(240, 220, 10, 256, 258, 300)
  pool.addColorStop(0, 'rgba(255, 255, 255, 0.75)')
  pool.addColorStop(1, 'rgba(255, 255, 255, 0)')
  g.fillStyle = pool
  g.fillRect(0, 0, 512, 512)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  sweepCache.set(which, tex)
  return tex
}

/**
 * The room the glossy surfaces reflect: a big softbox overhead, a bright
 * surround and a darker floor. Without this, clearcoat has nothing to catch
 * and the food loses its sheen. Painted, then prefiltered by PMREMGenerator.
 */
function envEquirect() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const g = c.getContext('2d')

  const room = g.createLinearGradient(0, 0, 0, 512)
  room.addColorStop(0, '#FFFFFF')
  room.addColorStop(0.42, '#F6EFE4')
  room.addColorStop(0.56, '#C9BBA6')
  room.addColorStop(1, '#5C5042')
  g.fillStyle = room
  g.fillRect(0, 0, 1024, 512)

  // the key softbox, up and to the left
  const box = g.createRadialGradient(300, 86, 10, 300, 86, 230)
  box.addColorStop(0, 'rgba(255,255,255,1)')
  box.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = box
  g.fillRect(0, 0, 1024, 512)

  // a cooler bounce card on the right, to keep highlights from going orange
  const bounce = g.createRadialGradient(790, 190, 10, 790, 190, 210)
  bounce.addColorStop(0, 'rgba(236,243,255,0.8)')
  bounce.addColorStop(1, 'rgba(236,243,255,0)')
  g.fillStyle = bounce
  g.fillRect(0, 0, 1024, 512)

  const tex = new THREE.CanvasTexture(c)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ------------------------------------------------------------------ studio */

class Studio {
  constructor() {
    this.ok = false
    this.renderer = null
    this.raf = null
    // true while the canvas is handed to a page and turning
    this.live = false
    this.spin = { dragging: false, pitch: PITCH, target: PITCH, vel: 0, auto: true }
    this.dummy = new THREE.Object3D()
    this.tint = new THREE.Color()
  }

  init() {
    if (this.renderer || this.ok === 'failed') return this.ok
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true, // needed for toDataURL thumbnails
      })
    } catch {
      this.ok = 'failed'
      return false
    }
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    // transparent when no background texture is set, so the hero and the
    // product page can show the page through the render
    this.renderer.setClearAlpha(0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.94
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.scene = new THREE.Scene()
    this.scene.background = backdrop()

    // gives the clearcoat and the wood something to reflect
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    pmrem.compileEquirectangularShader()
    const src = envEquirect()
    this.scene.environment = pmrem.fromEquirectangular(src).texture
    src.dispose()
    pmrem.dispose()

    this.camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100)

    // kept low on purpose: lift these and the food goes chalky
    this.scene.add(new THREE.AmbientLight(0xfff4e6, 0.26))
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x7a6244, 0.38))

    // one key light, and it is the one that casts the shadow
    const key = new THREE.DirectionalLight(0xfff6e8, 2.5)
    key.position.set(-4.2, 8.4, 5.2)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.near = 1
    key.shadow.camera.far = 26
    key.shadow.camera.left = -4.4
    key.shadow.camera.right = 4.4
    key.shadow.camera.top = 4.4
    key.shadow.camera.bottom = -4.4
    key.shadow.bias = -0.0012
    key.shadow.normalBias = 0.022
    key.shadow.radius = 3
    this.scene.add(key)

    // a cool bounce on the right so the highlights don't all go orange
    const fill = new THREE.DirectionalLight(0xeaf1ff, 0.58)
    fill.position.set(5.4, 2.6, 4.2)
    this.scene.add(fill)

    // a warm edge from behind, which is what separates the bowl from the sweep
    const rim = new THREE.DirectionalLight(0xffd9ae, 0.85)
    rim.position.set(1.2, 3.4, -5.6)
    this.scene.add(rim)

    // The contact shadow. ShadowMaterial draws nothing but the shadow itself,
    // so it lands on the painted sweep without a visible plane edge.
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(7, 64),
      new THREE.ShadowMaterial({ color: 0x4a3418, opacity: 0.33 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = GROUND
    ground.receiveShadow = true
    this.scene.add(ground)

    // the sweep and the shadow stay put; only the rig turns
    this.rig = new THREE.Group()
    this.scene.add(this.rig)

    this.applyCamera()
    this.ok = true
    return true
  }

  get canvas() {
    return this.renderer?.domElement ?? null
  }

  /**
   * Looking up and down moves the camera, it does not tip the bowl. Tipping
   * the rig would drag the bowl through the floor and take the shadow with it.
   */
  applyCamera() {
    const p = this.spin.pitch
    this.camera.position.set(0, Math.sin(p) * CAM_DIST, Math.cos(p) * CAM_DIST)
    this.camera.lookAt(0, -0.16, 0)
  }

  clearRig() {
    while (this.rig.children.length) {
      const child = this.rig.children.pop()
      child.traverse((o) => {
        o.geometry?.dispose()
        if (o.material) {
          const list = Array.isArray(o.material) ? o.material : [o.material]
          list.forEach((m) => m.dispose())
        }
      })
    }
  }

  /** Scatter `count` of each of the 8 variants into a dome inside the bowl. */
  pile(kind, tones, cy, radius, height, count) {
    const cfg = SETTLE[kind] ?? SETTLE.mix
    const build = FOOD[kind] ?? FOOD.mix

    for (let v = 0; v < 8; v++) {
      const mesh = new THREE.InstancedMesh(build(v), food(tones[v]), count)
      mesh.castShadow = true
      mesh.receiveShadow = true

      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const rr = Math.sqrt(Math.random()) * radius
        const dome = Math.sqrt(Math.max(0, 1 - (rr / radius) ** 2)) * height
        this.dummy.position.set(Math.cos(a) * rr, cy + Math.random() * dome, Math.sin(a) * rr)
        this.dummy.rotation.set(
          (Math.random() - 0.5) * cfg.tilt,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * cfg.tilt,
        )
        const s = 0.86 + Math.random() * 0.36
        this.dummy.scale.set(s, s, s)
        this.dummy.updateMatrix()
        mesh.setMatrixAt(i, this.dummy.matrix)

        // a little colour drift, so a pile is not eight flat shades
        const j = 0.86 + Math.random() * 0.26
        this.tint.setRGB(j, j * (0.96 + Math.random() * 0.07), j * (0.9 + Math.random() * 0.12))
        mesh.setColorAt(i, this.tint)
      }

      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      this.rig.add(mesh)
    }
  }

  /** Peanuts, curry leaves and spice, sitting on the surface of the pile. */
  garnish(cy, radius, height) {
    const onTop = (geo, mat, n, tilt) => {
      const mesh = new THREE.InstancedMesh(geo, mat, n)
      mesh.castShadow = true
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const rr = Math.sqrt(Math.random()) * radius * 0.93
        const dome = Math.sqrt(Math.max(0, 1 - (rr / radius) ** 2)) * height
        this.dummy.position.set(
          Math.cos(a) * rr,
          cy + dome * (0.84 + Math.random() * 0.17),
          Math.sin(a) * rr,
        )
        this.dummy.rotation.set(
          (Math.random() - 0.5) * tilt,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * tilt,
        )
        const s = 0.82 + Math.random() * 0.36
        this.dummy.scale.set(s, s, s)
        this.dummy.updateMatrix()
        mesh.setMatrixAt(i, this.dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
      this.rig.add(mesh)
    }

    const spread = radius / 1.56

    // peanuts, split across the three browns
    const nut = new THREE.SphereGeometry(0.1, 14, 10)
    nut.scale(1.0, 0.8, 1.44)
    for (const col of PEANUT) {
      onTop(
        nut.clone(),
        new THREE.MeshPhysicalMaterial({
          color: col,
          roughness: 0.4,
          clearcoat: 0.55,
          clearcoatRoughness: 0.3,
        }),
        Math.round(6 * spread),
        0.7,
      )
    }

    // curry leaves
    const blade = new THREE.Shape()
    blade.moveTo(0, -0.23)
    blade.quadraticCurveTo(0.15, 0, 0, 0.27)
    blade.quadraticCurveTo(-0.15, 0, 0, -0.23)
    const leafGeo = new THREE.ExtrudeGeometry(blade, { depth: 0.014, bevelEnabled: false })
    leafGeo.rotateX(-Math.PI / 2)
    leafGeo.center()
    for (const col of LEAF) {
      onTop(
        leafGeo.clone(),
        new THREE.MeshPhysicalMaterial({
          color: col,
          roughness: 0.36,
          clearcoat: 0.62,
          clearcoatRoughness: 0.26,
          side: THREE.DoubleSide,
        }),
        Math.round(4 * spread),
        0.55,
      )
    }

    // ground spice clinging to everything
    const speck = new THREE.SphereGeometry(0.019, 6, 5)
    for (const col of SPICE) {
      onTop(
        speck.clone(),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.62 }),
        Math.round(18 * spread),
        3.14,
      )
    }
  }

  /**
   * Pieces caught in the air above the bowl, as if the shot were taken while
   * someone was still pouring. Only the hero uses this - on a 240px card it
   * would read as dirt on the lens.
   */
  airborne(kind, tones, cy, radius, height, count) {
    const build = FOOD[kind] ?? FOOD.mix
    for (let v = 0; v < 8; v++) {
      const mesh = new THREE.InstancedMesh(build(v), food(tones[v]), count)
      mesh.castShadow = false
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        // pushed outward, so the middle stays clear and the bowl reads
        const rr = (0.35 + Math.random() * 0.65) * radius
        this.dummy.position.set(
          Math.cos(a) * rr,
          cy + Math.random() * height,
          Math.sin(a) * rr * 0.6,
        )
        this.dummy.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
        )
        const s = 0.42 + Math.random() * 0.3
        this.dummy.scale.set(s, s, s)
        this.dummy.updateMatrix()
        mesh.setMatrixAt(i, this.dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
      this.rig.add(mesh)
    }
  }

  compose(product, { scatter = false } = {}) {
    this.clearRig()
    const info = clayBowl(this.rig)
    const tones = TONES[product.tone] ?? TONES.golden
    const cfg = SETTLE[product.kind] ?? SETTLE.mix

    this.pile(product.kind, tones, info.fillY, info.fillR, cfg.h, cfg.count)
    this.garnish(info.fillY, info.fillR, cfg.h)
    // the airborne pieces read as crumbs, not as a second helping - keep
    // them small and close, or they look like the bowl exploded
    if (scatter) this.airborne(product.kind, tones, info.fillY + 0.95, info.fillR * 1.35, 1.9, 3)

    this.rig.rotation.set(0, -0.55, 0)
    this.spin.pitch = this.spin.target = PITCH
    this.applyCamera()
  }

  /**
   * Render one product to a still JPEG data URL.
   *
   * `size` is the square pixel size, `scatter` adds the airborne pieces and
   * `pull` moves the camera back, which the hero needs so the scatter does
   * not run off the edges.
   */
  thumbnail(product, { size = THUMB, scatter = false, pull = 0, on = 'card' } = {}) {
    if (!this.init()) return null
    const clear = on === 'none'
    this.scene.background = backdrop(on)
    this.compose(product, { scatter })

    if (pull) {
      const p = this.spin.pitch
      const d = CAM_DIST + pull
      this.camera.position.set(0, Math.sin(p) * d, Math.cos(p) * d)
      this.camera.lookAt(0, -0.16, 0)
    }

    this.renderer.setSize(size, size, false)
    this.camera.aspect = 1
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
    // PNG when there is no background, because JPEG would flatten the
    // transparent pixels to black
    const url = clear
      ? this.renderer.domElement.toDataURL('image/png')
      : this.renderer.domElement.toDataURL('image/jpeg', 0.88)

    if (pull) this.applyCamera()
    return url
  }

  /**
   * Put the live canvas into `el` and start turning `product`.
   *
   * There is one WebGL context for the whole site, so while this is held
   * the thumbnail queue must leave it alone - rendering a card would
   * resize the canvas and recompose the scene under the visitor's hands.
   * `live` is the flag useThumbnails waits on.
   */
  attach(el, product, { reducedMotion = false, on = 'none' } = {}) {
    if (!this.init()) return
    this.live = true
    this.scene.background = backdrop(on)
    this.compose(product)
    this.spin.dragging = false
    this.spin.vel = 0
    this.spin.auto = !reducedMotion
    el.appendChild(this.renderer.domElement)
    this.resize()
    if (!this.raf) this.loop()
  }

  detach() {
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = null
    this.live = false
    this.canvas?.parentNode?.removeChild(this.canvas)
  }

  resize() {
    const box = this.canvas?.parentNode
    if (!box) return
    const { clientWidth: w, clientHeight: h } = box
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    const s = this.spin

    if (!s.dragging) {
      if (s.auto) this.rig.rotation.y += 0.0032
      else if (Math.abs(s.vel) > 0.00004) {
        this.rig.rotation.y += s.vel
        s.vel *= 0.945
      }
    }

    if (Math.abs(s.target - s.pitch) > 0.0004) {
      s.pitch += (s.target - s.pitch) * 0.12
      this.applyCamera()
    }

    this.renderer.render(this.scene, this.camera)
  }

  dragStart() {
    this.spin.dragging = true
    this.spin.auto = false
  }

  dragBy(dx, dy) {
    if (!this.spin.dragging) return
    this.rig.rotation.y += dx * 0.0115
    this.tiltBy(dy * 0.0042)
    this.spin.vel = dx * 0.0011
  }

  dragEnd() {
    this.spin.dragging = false
  }

  nudge(dir) {
    this.spin.auto = false
    this.rig.rotation.y += dir * 0.14
  }

  tiltBy(d) {
    this.spin.target = Math.max(PITCH_MIN, Math.min(PITCH_MAX, this.spin.target + d))
  }
}

export const studio = new Studio()
