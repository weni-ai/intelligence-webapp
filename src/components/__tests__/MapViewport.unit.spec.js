import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { Map, View, Feature } from 'ol';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';

import MapViewport from '../MapViewport.vue';

vi.mock('ol', () => ({
  Map: vi.fn(),
  View: vi.fn(),
  Feature: vi.fn(),
}));

vi.mock('ol/source', () => ({
  OSM: vi.fn(),
  Vector: vi.fn(),
}));

vi.mock('ol/layer', () => ({
  Tile: vi.fn(),
  Vector: vi.fn(),
}));

vi.mock('ol/proj', () => ({
  fromLonLat: vi.fn((coords) => coords),
}));

vi.mock('ol/geom', () => ({
  Point: vi.fn(),
}));

vi.mock('ol/style', () => ({
  Icon: vi.fn(),
  Style: vi.fn(),
}));

vi.mock('@/assets/images/icons/place.png', () => ({
  default: 'mocked-place-icon.png',
}));

describe('MapViewport.vue', () => {
  let wrapper;
  let mockMap;
  let mockView;
  let mockFeature;
  let mockPoint;
  let mockOSMSource;
  let mockVectorSource;
  let mockTileLayer;
  let mockVectorLayer;
  let mockIcon;
  let mockStyle;

  const mapElement = () => wrapper.find('[data-testid="map-viewport"]');

  const createValidGeolocation = () => '40.7128,-74.0060'; // New York coordinates
  const createEmptyGeolocation = () => '';

  const createWrapper = (props = {}) => {
    return mount(MapViewport, {
      props: {
        geolocation: createValidGeolocation(),
        ...props,
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockMap = { target: null, layers: [], view: null };
    mockView = { center: null, zoom: 12 };
    mockFeature = {};
    mockPoint = {};
    mockOSMSource = {};
    mockVectorSource = { features: [] };
    mockTileLayer = { source: null };
    mockVectorLayer = { source: null, style: null };
    mockIcon = { src: null, scale: 0.8 };
    mockStyle = { image: null };

    Map.mockImplementation((config) => {
      mockMap.target = config.target;
      mockMap.layers = config.layers;
      mockMap.view = config.view;
      mockMap.controls = config.controls;
      return mockMap;
    });

    View.mockImplementation((config) => {
      mockView.center = config.center;
      mockView.zoom = config.zoom;
      return mockView;
    });

    Feature.mockImplementation((geometry) => {
      mockFeature.geometry = geometry;
      return mockFeature;
    });

    Point.mockImplementation((coordinates) => {
      mockPoint.coordinates = coordinates;
      return mockPoint;
    });

    OSM.mockImplementation(() => mockOSMSource);
    VectorSource.mockImplementation((config) => {
      mockVectorSource.features = config.features;
      return mockVectorSource;
    });

    TileLayer.mockImplementation((config) => {
      mockTileLayer.source = config.source;
      return mockTileLayer;
    });

    VectorLayer.mockImplementation((config) => {
      mockVectorLayer.source = config.source;
      mockVectorLayer.style = config.style;
      return mockVectorLayer;
    });

    Icon.mockImplementation((config) => {
      mockIcon.src = config.src;
      mockIcon.scale = config.scale;
      return mockIcon;
    });

    Style.mockImplementation((config) => {
      mockStyle.image = config.image;
      return mockStyle;
    });

    wrapper = createWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('Component Rendering', () => {
    it('renders the component successfully', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('renders the map container element', () => {
      expect(mapElement().exists()).toBe(true);
      expect(mapElement().classes()).toContain('map-viewport');
    });

    it('sets up template ref for map element', () => {
      expect(wrapper.vm.mapElement).toBeDefined();
    });
  });

  describe('Props Handling', () => {
    it('accepts geolocation prop with default empty string', () => {
      const wrapperWithDefaults = mount(MapViewport);
      expect(wrapperWithDefaults.props('geolocation')).toBe('');
    });

    it('accepts custom geolocation prop', () => {
      const customGeolocation = '51.5074,-0.1278'; // London coordinates
      const customWrapper = createWrapper({ geolocation: customGeolocation });
      expect(customWrapper.props('geolocation')).toBe(customGeolocation);
    });

    it('handles empty geolocation prop', () => {
      const emptyWrapper = createWrapper({
        geolocation: createEmptyGeolocation(),
      });
      expect(emptyWrapper.props('geolocation')).toBe('');
    });
  });

  describe('Coordinate Processing', () => {
    it('processes valid geolocation coordinates correctly', () => {
      const geolocation = '40.7128,-74.0060';
      const testWrapper = createWrapper({ geolocation });

      // Coordinates should be processed: [latitude, longitude] -> [longitude, latitude]
      expect(fromLonLat).toHaveBeenCalledWith([-74.006, 40.7128]);
    });

    it('handles coordinate transformation through fromLonLat', () => {
      const expectedCoords = [-74.006, 40.7128];
      fromLonLat.mockReturnValue(expectedCoords);

      const testWrapper = createWrapper();
      const coordinates = testWrapper.vm.coordinates;

      expect(fromLonLat).toHaveBeenCalledWith([-74.006, 40.7128]);
      expect(coordinates).toEqual(expectedCoords);
    });

    it('creates point geometry from coordinates', () => {
      const testWrapper = createWrapper();
      const point = testWrapper.vm.point;

      expect(Point).toHaveBeenCalledWith(testWrapper.vm.coordinates);
      expect(point).toBe(mockPoint);
    });
  });

  describe('Map Initialization', () => {
    it('initializes OpenStreetMap tile layer', () => {
      expect(OSM).toHaveBeenCalled();
      expect(TileLayer).toHaveBeenCalledWith({
        source: mockOSMSource,
      });
    });

    it('creates vector source with feature', () => {
      expect(VectorSource).toHaveBeenCalledWith({
        features: [mockFeature],
      });
    });

    it('creates vector layer with custom marker style', () => {
      expect(VectorLayer).toHaveBeenCalledWith({
        source: mockVectorSource,
        style: mockStyle,
      });
    });

    it('sets up marker icon with correct properties', () => {
      expect(Icon).toHaveBeenCalledWith({
        src: 'mocked-place-icon.png',
        scale: 0.8,
      });
    });

    it('creates map style with icon', () => {
      expect(Style).toHaveBeenCalledWith({
        image: mockIcon,
      });
    });

    it('initializes map with correct configuration', () => {
      expect(Map).toHaveBeenCalledWith({
        layers: [mockTileLayer, mockVectorLayer],
        target: wrapper.vm.mapElement,
        view: mockView,
        controls: [],
      });
    });

    it('sets up map view with correct center and zoom', () => {
      expect(View).toHaveBeenCalledWith({
        center: wrapper.vm.coordinates,
        zoom: 12,
      });
    });

    it('disables map controls', () => {
      expect(Map).toHaveBeenCalledWith(
        expect.objectContaining({
          controls: [],
        }),
      );
    });
  });

  describe('Component Lifecycle', () => {
    it('targets the correct DOM element', () => {
      expect(Map).toHaveBeenCalledWith(
        expect.objectContaining({
          target: wrapper.vm.mapElement,
        }),
      );
    });
  });

  describe('OpenLayers Integration', () => {
    it('uses correct OpenLayers components', () => {
      expect(Map).toHaveBeenCalled();
      expect(View).toHaveBeenCalled();
      expect(Feature).toHaveBeenCalled();
      expect(OSM).toHaveBeenCalled();
      expect(VectorSource).toHaveBeenCalled();
      expect(TileLayer).toHaveBeenCalled();
      expect(VectorLayer).toHaveBeenCalled();
      expect(Point).toHaveBeenCalled();
      expect(Icon).toHaveBeenCalled();
      expect(Style).toHaveBeenCalled();
    });

    it('configures map layers in correct order', () => {
      expect(Map).toHaveBeenCalledWith(
        expect.objectContaining({
          layers: [mockTileLayer, mockVectorLayer],
        }),
      );
    });

    it('uses place icon for marker', () => {
      expect(Icon).toHaveBeenCalledWith(
        expect.objectContaining({
          src: 'mocked-place-icon.png',
        }),
      );
    });

    it('sets appropriate marker scale', () => {
      expect(Icon).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: 0.8,
        }),
      );
    });
  });
});
