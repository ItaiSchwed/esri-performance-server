export const GLOBALS = {
    /**
     * indicates whether the generator should restart the DB each cycle
     */
    RESET_ENTITIES: true,
    /**
     * indicates whether the generator should randomize entities in the amount of ENTITIES_COUNT
     */
    RANDOMIZE_ENTITIES_COUNT: true,
    /**
     * the count of entities on map.
     * being use only if RANDOMIZE_ENTITIES_COUNT is true
     */
    ENTITIES_COUNT: 1000,
    /**
     * the count of cycles the server will activate
     */
    CYCLES_COUNT: 5
};
