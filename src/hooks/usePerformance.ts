import { useEffect, useRef, useCallback, useMemo, useState } from 'react';

/**
 * Hook pour optimiser les performances des composants
 */
export const usePerformance = () => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    lastRenderTime.current = Date.now();
  });

  /**
   * Mesure le temps d'exécution d'une fonction
   */
  const measureTime = useCallback(async <T>(
    fn: () => Promise<T> | T,
    label: string = 'Function execution'
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      console.log(`${label}: ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${label} failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  }, []);

  /**
   * Debounce une fonction
   */
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  /**
   * Throttle une fonction
   */
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }, []);

  /**
   * Mémoisation avec cache LRU
   */
  const useMemoWithCache = useCallback(<T>(
    factory: () => T,
    deps: React.DependencyList,
    cacheKey: string,
    maxSize: number = 100
  ): T => {
    const cache = useMemo(() => new Map<string, { value: T; timestamp: number }>(), []);
    
    return useMemo(() => {
      const now = Date.now();
      const cached = cache.get(cacheKey);
      
      if (cached && now - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
        return cached.value;
      }
      
      const value = factory();
      cache.set(cacheKey, { value, timestamp: now });
      
      // Nettoyer le cache si nécessaire
      if (cache.size > maxSize) {
        const oldestKey = Array.from(cache.entries())
          .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
        cache.delete(oldestKey);
      }
      
      return value;
    }, deps);
  }, []);

  /**
   * Intersection Observer pour le lazy loading
   */
  const useIntersectionObserver = useCallback((
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    
    const observe = useCallback((element: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      if (element) {
        observerRef.current = new IntersectionObserver(callback, options);
        observerRef.current.observe(element);
      }
    }, [callback, options]);
    
    useEffect(() => {
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, []);
    
    return observe;
  }, []);

  /**
   * Virtual scrolling pour les longues listes
   */
  const useVirtualScrolling = useCallback((
    items: any[],
    itemHeight: number,
    containerHeight: number
  ) => {
    const [scrollTop, setScrollTop] = useState(0);
    
    const visibleItems = useMemo(() => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      );
      
      return items.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        index: startIndex + index,
        style: {
          position: 'absolute' as const,
          top: (startIndex + index) * itemHeight,
          height: itemHeight,
        },
      }));
    }, [items, itemHeight, containerHeight, scrollTop]);
    
    const totalHeight = items.length * itemHeight;
    
    return {
      visibleItems,
      totalHeight,
      onScroll: (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
      },
    };
  }, []);

  /**
   * Optimisation des images
   */
  const useImageOptimization = useCallback((
    src: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
    } = {}
  ) => {
    const [optimizedSrc, setOptimizedSrc] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!src) return;

      setLoading(true);
      setError(null);

      // Simuler l'optimisation d'image
      const optimizeImage = async () => {
        try {
          // En production, utiliser un service comme Cloudinary ou ImageKit
          const optimized = `${src}?w=${options.width || 800}&q=${options.quality || 80}&f=${options.format || 'webp'}`;
          setOptimizedSrc(optimized);
        } catch (err) {
          setError('Erreur lors de l\'optimisation de l\'image');
        } finally {
          setLoading(false);
        }
      };

      optimizeImage();
    }, [src, options.width, options.height, options.quality, options.format]);

    return { optimizedSrc, loading, error };
  }, []);

  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current,
    measureTime,
    debounce,
    throttle,
    useMemoWithCache,
    useIntersectionObserver,
    useVirtualScrolling,
    useImageOptimization,
  };
};

/**
 * Hook pour la gestion de la mémoire
 */
export const useMemoryManagement = () => {
  const cleanupFunctions = useRef<(() => void)[]>([]);

  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  }, []);

  const cleanup = useCallback(() => {
    cleanupFunctions.current.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Erreur lors du nettoyage:', error);
      }
    });
    cleanupFunctions.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { addCleanup, cleanup };
};

/**
 * Hook pour le monitoring des performances
 */
export const usePerformanceMonitoring = () => {
  const metrics = useRef<{
    renderCount: number;
    averageRenderTime: number;
    slowRenders: number;
    memoryUsage?: number;
  }>({
    renderCount: 0,
    averageRenderTime: 0,
    slowRenders: 0,
  });

  const startRender = useCallback(() => {
    return performance.now();
  }, []);

  const endRender = useCallback((startTime: number) => {
    const renderTime = performance.now() - startTime;
    metrics.current.renderCount++;
    metrics.current.averageRenderTime = 
      (metrics.current.averageRenderTime * (metrics.current.renderCount - 1) + renderTime) / 
      metrics.current.renderCount;
    
    if (renderTime > 16) { // Plus de 16ms (60fps)
      metrics.current.slowRenders++;
    }

    // En production, envoyer les métriques
    if (process.env.NODE_ENV === 'production' && metrics.current.renderCount % 100 === 0) {
      // TODO: Envoyer vers un service de monitoring
      console.log('Performance metrics:', metrics.current);
    }
  }, []);

  return { startRender, endRender, metrics: metrics.current };
}; 