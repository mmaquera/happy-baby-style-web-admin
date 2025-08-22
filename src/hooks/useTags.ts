import { useState, useCallback, useMemo } from 'react';

// Types for tag metadata
export interface TagMetadata {
  color: string;
  description: string;
  category: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface TagWithMetadata {
  [tagName: string]: TagMetadata;
}

// Default tags with metadata
const DEFAULT_TAGS: TagWithMetadata = {
  'recién nacido': {
    color: '#ff6b6b',
    description: 'Productos para recién nacidos (0-1 mes)',
    category: 'edad',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString()
  },
  '0-3 meses': {
    color: '#4ecdc4',
    description: 'Productos para bebés de 0 a 3 meses',
    category: 'edad',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString()
  },
  '3-6 meses': {
    color: '#45b7d1',
    description: 'Productos para bebés de 3 a 6 meses',
    category: 'edad',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString()
  },
  '6-12 meses': {
    color: '#96ceb4',
    description: 'Productos para bebés de 6 a 12 meses',
    category: 'edad',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString()
  },
  '12-24 meses': {
    color: '#feca57',
    description: 'Productos para bebés de 12 a 24 meses',
    category: 'edad',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString()
  },
  'orgánico': {
    color: '#48dbf8',
    description: 'Productos orgánicos certificados',
    category: 'calidad',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString()
  },
  'ecológico': {
    color: '#0abde3',
    description: 'Productos ecológicos y sostenibles',
    category: 'calidad',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString()
  },
  'premium': {
    color: '#ff9ff3',
    description: 'Productos premium de alta calidad',
    category: 'calidad',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString()
  },
  'básico': {
    color: '#54a0ff',
    description: 'Productos básicos esenciales',
    category: 'calidad',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString()
  }
};

// Hook for managing tags with metadata
export const useTags = () => {
  const [customTags, setCustomTags] = useState<TagWithMetadata>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combine default and custom tags
  const allTags = useMemo(() => ({
    ...DEFAULT_TAGS,
    ...customTags
  }), [customTags]);

  // Get active tags only
  const activeTags = useMemo(() => {
    const active: TagWithMetadata = {};
    Object.entries(allTags).forEach(([tagName, metadata]) => {
      if (metadata.isActive) {
        active[tagName] = metadata;
      }
    });
    return active;
  }, [allTags]);

  // Get tags by category
  const getTagsByCategory = useCallback((category: string) => {
    const categoryTags: TagWithMetadata = {};
    Object.entries(activeTags).forEach(([tagName, metadata]) => {
      if (metadata.category === category) {
        categoryTags[tagName] = metadata;
      }
    });
    return categoryTags;
  }, [activeTags]);

  // Get popular tags (by usage count)
  const getPopularTags = useCallback((limit: number = 5) => {
    return Object.entries(activeTags)
      .sort(([, a], [, b]) => b.usageCount - a.usageCount)
      .slice(0, limit)
      .reduce((acc, [tagName, metadata]) => {
        acc[tagName] = metadata;
        return acc;
      }, {} as TagWithMetadata);
  }, [activeTags]);

  // Create new custom tag
  const createTag = useCallback(async (tagName: string, metadata: Omit<TagMetadata, 'usageCount' | 'createdAt'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate tag name
      if (!tagName.trim()) {
        throw new Error('El nombre de la etiqueta es requerido');
      }
      
      if (allTags[tagName.toLowerCase()]) {
        throw new Error('Ya existe una etiqueta con ese nombre');
      }

      const newTag: TagMetadata = {
        ...metadata,
        usageCount: 0,
        createdAt: new Date().toISOString()
      };

      setCustomTags(prev => ({
        ...prev,
        [tagName.toLowerCase()]: newTag
      }));

      return { success: true, tag: newTag };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear la etiqueta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [allTags]);

  // Update existing tag
  const updateTag = useCallback(async (tagName: string, updates: Partial<TagMetadata>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!allTags[tagName]) {
        throw new Error('La etiqueta no existe');
      }

      const updatedTag: TagMetadata = {
        ...allTags[tagName],
        ...updates
      };

      if (customTags[tagName]) {
        setCustomTags(prev => ({
          ...prev,
          [tagName]: updatedTag
        }));
      } else {
        // Update default tag (creates a custom override)
        setCustomTags(prev => ({
          ...prev,
          [tagName]: updatedTag
        }));
      }

      return { success: true, tag: updatedTag };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar la etiqueta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [allTags, customTags]);

  // Delete custom tag
  const deleteTag = useCallback(async (tagName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!customTags[tagName]) {
        throw new Error('Solo se pueden eliminar etiquetas personalizadas');
      }

      setCustomTags(prev => {
        const newTags = { ...prev };
        delete newTags[tagName];
        return newTags;
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar la etiqueta';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [customTags]);

  // Increment usage count for a tag
  const incrementUsage = useCallback((tagName: string) => {
    if (allTags[tagName]) {
      const updatedTag: TagMetadata = {
        ...allTags[tagName],
        usageCount: allTags[tagName].usageCount + 1
      };

      if (customTags[tagName]) {
        setCustomTags(prev => ({
          ...prev,
          [tagName]: updatedTag
        }));
      } else {
        // Create custom override for default tag
        setCustomTags(prev => ({
          ...prev,
          [tagName]: updatedTag
        }));
      }
    }
  }, [allTags, customTags]);

  // Search tags
  const searchTags = useCallback((query: string) => {
    const searchTerm = query.toLowerCase();
    const results: TagWithMetadata = {};
    
    Object.entries(activeTags).forEach(([tagName, metadata]) => {
      if (
        tagName.toLowerCase().includes(searchTerm) ||
        metadata.description.toLowerCase().includes(searchTerm) ||
        metadata.category.toLowerCase().includes(searchTerm)
      ) {
        results[tagName] = metadata;
      }
    });
    
    return results;
  }, [activeTags]);

  // Get tag suggestions based on context
  const getTagSuggestions = useCallback((context: string, limit: number = 3) => {
    const suggestions: TagWithMetadata = {};
    
    // Simple context-based suggestions
    if (context.includes('edad') || context.includes('meses')) {
      const ageTags = getTagsByCategory('edad');
      Object.entries(ageTags).slice(0, limit).forEach(([tagName, metadata]) => {
        suggestions[tagName] = metadata;
      });
    } else if (context.includes('calidad') || context.includes('premium')) {
      const qualityTags = getTagsByCategory('calidad');
      Object.entries(qualityTags).slice(0, limit).forEach(([tagName, metadata]) => {
        suggestions[tagName] = metadata;
      });
    } else {
      // Return popular tags as fallback
      const popularTags = getPopularTags(limit);
      Object.assign(suggestions, popularTags);
    }
    
    return suggestions;
  }, [getTagsByCategory, getPopularTags]);

  return {
    // State
    allTags,
    activeTags,
    customTags,
    isLoading,
    error,
    
    // Actions
    createTag,
    updateTag,
    deleteTag,
    incrementUsage,
    
    // Queries
    getTagsByCategory,
    getPopularTags,
    searchTags,
    getTagSuggestions,
    
    // Utilities
    clearError: () => setError(null)
  };
};
