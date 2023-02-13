// Serve kpmp/OME-TIFF folder

export const kpmp2023 = {
  version: '1.0.16',
  name: 'KPMP',
  description: 'multi-obsType segmentations',
  datasets: [
    {
      uid: 'S-1905-017737',
      name: 'S-1905-017737',
      files: [
        {
          fileType: 'obsSegmentations.ome-tiff',
          url: 'http://localhost:8000/S-1905-017737/S-1905-017737_PAS_2of2.ome.tif',
          options: {
           // offsetsUrl: 'http://localhost:8000/S-1905-017737/S-1905-017737_PAS_2of2.offsets.json',
          },
          coordinationValues: {
            image: 'S-1905-017737',
          },
        },
        {
          fileType: 'image.ome-tiff',
          url: 'http://localhost:8000/S-1905-017737/S-1905-017737_PAS_2of2_bf.ome.tif',
          options: {
            // offsetsUrl: 'http://localhost:8000/S-1905-017737/S-1905-017737_PAS_2of2_bf.offsets.json',
          },
          coordinationValues: {
            image: 'S-1905-017737_bf',
          },
        },
        /*{
          fileType: 'obsFeatureMatrix.csv',
          url: 'http://localhost:8000/fake_glom_info.csv',
          coordinationValues: {
            obsType: 'Glomeruli',
            featureType: 'feature',
            featureValueType: 'value',
          },
        },
        {
          fileType: 'obsFeatureMatrix.csv',
          url: 'http://localhost:8000/fake_tub_info.csv',
          coordinationValues: {
            obsType: 'Tubules',
            featureType: 'feature',
            featureValueType: 'value',
          },
        },*/
      ],
    },
  ],
  initStrategy: 'auto',
  coordinationSpace: {
    image: {
      bitmask: 'S-1905-017737',
      rgb: 'S-1905-017737_bf',
    },
    spatialImageLayer: {
      histology: 'histology',
    },
    spatialImageChannel: {
      R: 'R',
      G: 'G',
      B: 'B',
    },
    spatialSegmentationLayer: {
      mi: 'mi',
      gsg: 'gsg',
      t: 't',
      a: 'a',
      g: 'g',
      ptc: 'ptc',
      ifta: 'ifta',
    },
    obsType: {
      A: 'Medullary Interstitia',
      B: 'Globally Sclerotic Glomeruli',
      C: 'Tubules',
      D: 'Arteries/Arterioles',
      E: 'Glomeruli',
      F: 'Peritubular Capillaries',
      G: 'Interstitial Fibrosis and Tubular Atrophy',
    },
    obsColorEncoding: {
      A: 'spatialChannelColor',
    },
    featureType: {
      A: 'feature',
    },
    featureValueType: {
      A: 'value',
    },
    featureSelection: {
      C: null,
      E: null,
    },
    spatialTargetC: {
      // bitmask
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      // RGB
      imageR: 0,
      imageG: 1,
      imageB: 2,
    },
    spatialChannelColor: {
      // bitmask
      A: [0xFF, 0xFF, 0xFF],
      B: [0x00, 0x92, 0x92],
      C: [0x24, 0xFF, 0x24],
      D: [0x00, 0x49, 0x49],
      E: [0xFF, 0xFF, 0x6D],
      F: [0xDB, 0x6D, 0x00],
      G: [0x00, 0x00, 0x00],
      // RGB
      imageR: [255, 0, 0],
      imageG: [0, 255, 0],
      imageB: [0, 0, 255],
    },
    spatialChannelVisible: {
      imageR: true,
      imageG: true,
      imageB: true,
    },
    spatialLayerVisible: {
      A: false,
      B: true,
      C: true,
      D: true,
      E: true,
      F: true,
      G: true,
      image: true,
    },
    spatialLayerOpacity: {
      // bitmask
      A: 1,
      B: 1,
      C: 1,
      D: 1,
      E: 1,
      F: 1,
      G: 1,
      // RGB
      image: 1,
    },
    spatialLayerFilled: {
      A: false,
      B: true,
    },
    spatialLayerStrokeWidth: {
      A: 1,
      B: 1,
      C: 1,
      D: 1,
      E: 1,
      F: 1,
      G: 1,
    },
    spatialTargetX: {
      A: 19375.01239458,
    },
    spatialTargetY: {
      A: 18524.67196937,
    },
    spatialZoom: {
      A: -4.60703913795,
    },
    metaCoordinationScopes: {
      metaA: {
        obsType: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        // TODO: treat segmentation layers more like the image layers. add a level for channels,
        // i.e., additional level of coordination. This should make it more clear that the different
        // segmentations are coming from different channels in the image file.
        // Also, a segmentation layer should correspond to a single bitmask file.
        spatialSegmentationLayer: ['mi', 'gsg', 't', 'a', 'g', 'ptc', 'ifta'],
        spatialImageLayer: ['histology'],
      },
    },
    metaCoordinationScopesBy: {
      metaA: {
        spatialImageLayer: {
          image: {
            histology: 'rgb',
          },
          spatialImageChannel: {
            histology: ['R', 'G', 'B'],
          },
          spatialLayerVisible: {
            histology: 'image',
          },
          spatialLayerOpacity: {
            histology: 'image',
          },
        },
        spatialImageChannel: {
          spatialTargetC: {
            R: 'imageR',
            G: 'imageG',
            B: 'imageB',
          },
          spatialChannelColor: {
            R: 'imageR',
            G: 'imageG',
            B: 'imageB',
          },
          spatialChannelVisible: {
            R: 'imageR',
            G: 'imageG',
            B: 'imageB',
          },
        },
        spatialSegmentationLayer: {
          image: {
            mi: 'bitmask',
            gsg: 'bitmask',
            t: 'bitmask',
            a: 'bitmask',
            g: 'bitmask',
            ptc: 'bitmask',
            ifta: 'bitmask',
          },
          obsType: {
            mi: 'A',
            gsg: 'B',
            t: 'C',
            a: 'D',
            g: 'E',
            ptc: 'F',
            ifta: 'G',
          },
          featureType: {
            g: 'A',
            t: 'A',
          },
          featureValueType: {
            g: 'A',
            t: 'A',
          },
          featureSelection: {
            g: 'C',
            t: 'E',
          },
          spatialTargetC: {
            mi: 'A',
            gsg: 'B',
            t: 'C',
            a: 'D',
            g: 'E',
            ptc: 'F',
            ifta: 'G',
          },
          obsColorEncoding: {
            mi: 'A',
            gsg: 'A',
            t: 'A',
            a: 'A',
            g: 'A',
            ptc: 'A',
            ifta: 'A',
          },
          spatialLayerVisible: {
            mi: 'A',
            gsg: 'B',
            t: 'C',
            a: 'D',
            g: 'E',
            ptc: 'F',
            ifta: 'G',
          },
          spatialLayerOpacity: {
            mi: 'A',
            gsg: 'B',
            t: 'C',
            a: 'D',
            g: 'E',
            ptc: 'F',
            ifta: 'G',
          },
          spatialChannelColor: {
            mi: 'A',
            gsg: 'B',
            t: 'C',
            a: 'D',
            g: 'E',
            ptc: 'F',
            ifta: 'G',
          },
          spatialLayerFilled: {
            mi: 'B',
            gsg: 'A',
            t: 'A',
            a: 'A',
            g: 'A',
            ptc: 'A',
            ifta: 'A',
          },
          spatialLayerStrokeWidth: {
            mi: 'A',
            gsg: 'A',
            t: 'A',
            a: 'A',
            g: 'A',
            ptc: 'A',
            ifta: 'A',
          },
        },
      },
    },
  },
  layout: [
    {
      component: 'spatial',
      coordinationScopes: {
        metaCoordinationScopes: ['metaA'],
        metaCoordinationScopesBy: ['metaA'],
        spatialTargetX: 'A',
        spatialTargetY: 'A',
        spatialZoom: 'A',
      },
      x: 0,
      y: 0,
      w: 8,
      h: 12,
    },
    {
      component: 'layerController',
      props: {
        disableChannelsIfRgbDetected: true,
      },
      coordinationScopes: {
        metaCoordinationScopes: ['metaA'],
        metaCoordinationScopesBy: ['metaA'],
        spatialTargetX: 'A',
        spatialTargetY: 'A',
        spatialZoom: 'A',
      },
      x: 8,
      y: 0,
      w: 4,
      h: 5,
    },
    {
      component: 'featureList',
      coordinationScopes: {
        obsType: 'C',
        featureType: 'A',
        featureValueType: 'A',
        featureSelection: 'C',
      },
      props: {
        title: 'Glomerulus Features',
      },
      x: 8,
      y: 5,
      w: 4,
      h: 1,
    },
    {
      component: 'featureValueHistogram',
      coordinationScopes: {
        obsType: 'C',
        featureType: 'A',
        featureValueType: 'A',
        featureSelection: 'C',
      },
      props: {
        aggregateFeatureValues: false,
      },
      x: 8,
      y: 6,
      w: 4,
      h: 2,
    },
    {
      component: 'featureList',
      coordinationScopes: {
        obsType: 'E',
        featureType: 'A',
        featureValueType: 'A',
        featureSelection: 'E',
      },
      props: {
        title: 'Tubule Features',
      },
      x: 8,
      y: 8,
      w: 4,
      h: 1,
    },
    {
      component: 'featureValueHistogram',
      coordinationScopes: {
        obsType: 'E',
        featureType: 'A',
        featureValueType: 'A',
        featureSelection: 'E',
      },
      props: {
        aggregateFeatureValues: false,
      },
      x: 8,
      y: 9,
      w: 4,
      h: 2,
    },
    {
      component: 'status',
      x: 8,
      y: 11,
      w: 4,
      h: 1,
    },
  ],
};
