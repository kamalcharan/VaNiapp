import { ChapterExplanations } from '../../types';

export const zoologyGeneticsExplanations: ChapterExplanations = {
  chapterId: 'zoology-genetics',
  subjectId: 'zoology',
  entries: [
    // ── zoo-gen-001: DNA full form (correct: a = deoxyribonucleic acid) ──

    {
      questionId: 'zoo-gen-001',
      selectedOptionId: 'b',
      misconception:
        'You dropped the "deoxy" prefix and wrote "diribonucleic acid," which is not a real term. DNA has deoxyribose sugar (one fewer oxygen than ribose), so the prefix is "deoxyribo-".',
      correctReasoning:
        'DNA stands for Deoxyribonucleic Acid. The "deoxy" indicates the sugar is deoxyribose (lacking one -OH group at the 2\' carbon compared to ribose in RNA). It is a nucleic acid made of nucleotide monomers.',
      tip: 'Deoxy = "minus one oxygen." DNA has deoxyribose, RNA has ribose. Spell it out once, and you will never forget.',
      conceptTag: 'dna-structure',
    },
    {
      questionId: 'zoo-gen-001',
      selectedOptionId: 'c',
      misconception:
        'The term is "deoxyribonucleic" -- all one word. "Deoxyribosenuclear acid" incorrectly splits the word and says "nuclear" instead of "nucleic." Nucleic acid refers to the polymer found in the nucleus.',
      correctReasoning:
        'DNA = Deoxyribonucleic Acid. "Nucleic" comes from "nucleus," where DNA was first discovered, but the acid itself is called a nucleic acid, not a nuclear acid. The correct full form must be memorized exactly.',
      tip: 'It is nucleic (adjective form of nucleus), not nuclear. Write the full form 3 times before exam day -- spelling traps are real in NEET.',
      conceptTag: 'dna-structure',
    },
    {
      questionId: 'zoo-gen-001',
      selectedOptionId: 'd',
      misconception:
        '"Dinucleotide acid" is a made-up term. A dinucleotide is a molecule with just two nucleotides (like NAD), not the full DNA polymer which contains millions of nucleotides.',
      correctReasoning:
        'DNA is Deoxyribonucleic Acid, a long polymer of millions of nucleotides arranged in a double helix. Each nucleotide has a phosphate group, deoxyribose sugar, and a nitrogenous base (A, T, G, or C).',
      tip: 'DNA = millions of nucleotides in a double helix. "Di" means two -- DNA is far more than two nucleotides. Don\'t fall for trick options.',
      conceptTag: 'dna-structure',
    },

    // ── zoo-gen-003: Mendel's law of segregation (correct: c = alleles separate during gamete formation) ──

    {
      questionId: 'zoo-gen-003',
      selectedOptionId: 'a',
      misconception:
        'Genes being linked means they are on the same chromosome and inherited together -- this is linkage, which is actually an exception to independent assortment, not the law of segregation.',
      correctReasoning:
        'The Law of Segregation states that during gamete formation, the two alleles of a gene separate so that each gamete receives only one allele. In a Tt plant, gametes are either T or t, never Tt together.',
      tip: 'Segregation = Separation of allele pairs. Linkage = genes stuck together on same chromosome. These are opposite ideas in genetics.',
      conceptTag: 'law-of-segregation',
    },
    {
      questionId: 'zoo-gen-003',
      selectedOptionId: 'b',
      misconception:
        'Blending of traits was the old pre-Mendelian idea that offspring are a "mix" of parents (like mixing paint). Mendel disproved this by showing traits remain discrete and reappear in later generations.',
      correctReasoning:
        'Mendel\'s Law of Segregation shows that alleles do not blend. In a cross of Tt x Tt, the F2 generation shows both tall (T) and short (t) phenotypes in a 3:1 ratio, proving alleles stay separate and intact.',
      tip: 'Blending theory = debunked. Mendel showed traits are particulate (discrete), not blended. This is a favorite NEET distractor.',
      conceptTag: 'law-of-segregation',
    },
    {
      questionId: 'zoo-gen-003',
      selectedOptionId: 'd',
      misconception:
        'The dominant allele does not "destroy" the recessive allele. The recessive allele is still present in the genotype -- it is simply not expressed in the heterozygous condition. It reappears in F2.',
      correctReasoning:
        'During segregation, both alleles (dominant and recessive) are faithfully copied and separated into different gametes. In Tt, the t allele is not destroyed -- it just isn\'t expressed phenotypically. When tt offspring form, the recessive trait appears.',
      tip: 'Recessive does not mean "deleted." It is silent in Tt but fully expressed in tt. Segregation keeps both alleles safe.',
      conceptTag: 'law-of-segregation',
    },

    // ── zoo-gen-006: Genotype ratio of monohybrid cross (correct: b = 1:2:1) ──

    {
      questionId: 'zoo-gen-006',
      selectedOptionId: 'a',
      misconception:
        '3:1 is the *phenotype* ratio of a monohybrid cross, not the genotype ratio. You likely confused phenotype (appearance) with genotype (genetic makeup).',
      correctReasoning:
        'In a Tt x Tt cross, the genotype ratio is 1 TT : 2 Tt : 1 tt (three distinct genotypes). The phenotype ratio is 3 tall : 1 short because TT and Tt both appear tall. Genotype and phenotype ratios are different.',
      tip: 'Genotype ratio = 1:2:1 (3 types). Phenotype ratio = 3:1 (2 types). NEET will specifically say "genotype" or "phenotype" -- read carefully!',
      conceptTag: 'monohybrid-cross',
    },
    {
      questionId: 'zoo-gen-006',
      selectedOptionId: 'c',
      misconception:
        '9:3:3:1 is the phenotype ratio of a *dihybrid* cross (two gene pairs), not a monohybrid cross. You may have mixed up mono- (one) and di- (two) hybrid crosses.',
      correctReasoning:
        'A monohybrid cross involves one gene with two alleles. Tt x Tt gives genotype ratio 1:2:1. A dihybrid cross (TtRr x TtRr) involves two genes and gives phenotype ratio 9:3:3:1. The question asked about monohybrid.',
      tip: 'Mono = 1 gene = 1:2:1 genotype. Di = 2 genes = 9:3:3:1 phenotype. Count the genes first, then pick the ratio.',
      conceptTag: 'monohybrid-cross',
    },
    {
      questionId: 'zoo-gen-006',
      selectedOptionId: 'd',
      misconception:
        '1:1 is the ratio from a test cross (Tt x tt), not a monohybrid cross between two heterozygotes. You may have confused the two types of crosses.',
      correctReasoning:
        'In a monohybrid cross Tt x Tt, the genotype ratio is 1 TT : 2 Tt : 1 tt = 1:2:1. A 1:1 ratio comes from a test cross (Tt x tt), which gives 1 Tt : 1 tt. Always check what cross is being described.',
      tip: 'Tt x Tt = 1:2:1 genotype. Tt x tt = 1:1 (test cross). The parents determine the ratio -- read the cross carefully.',
      conceptTag: 'monohybrid-cross',
    },

    // ── zoo-gen-009: Male genotype in humans (correct: d = XY) ──

    {
      questionId: 'zoo-gen-009',
      selectedOptionId: 'a',
      misconception:
        'XX is the female genotype in humans. You swapped the sex chromosome combinations. Males have one X and one Y; females have two X chromosomes.',
      correctReasoning:
        'In humans, sex is determined by sex chromosomes: females are XX and males are XY. The Y chromosome carries the SRY gene, which triggers male development. The father\'s sperm (X or Y) determines the sex of the child.',
      tip: 'XX = female, XY = male. The Y chromosome is the "male-maker." Father determines the sex of the baby, not the mother.',
      conceptTag: 'sex-determination',
    },
    {
      questionId: 'zoo-gen-009',
      selectedOptionId: 'b',
      misconception:
        'XO is the genotype seen in Turner syndrome (a chromosomal disorder) where one X is missing. It is also used in the XX-XO sex determination system of some insects like grasshoppers, not in normal human males.',
      correctReasoning:
        'Normal human males have XY genotype (46, XY). XO (45, X) is Turner syndrome -- a female with only one X chromosome who may show short stature, webbed neck, and infertility. Humans use the XX-XY system, not XX-XO.',
      tip: 'XO = Turner syndrome (monosomy X) = not normal male. XY = normal male. NEET often tests chromosomal disorders alongside sex determination.',
      conceptTag: 'sex-determination',
    },
    {
      questionId: 'zoo-gen-009',
      selectedOptionId: 'c',
      misconception:
        'ZW is the sex determination system used in birds, butterflies, and some reptiles -- where ZW = female and ZZ = male. This is opposite to the human XX-XY system.',
      correctReasoning:
        'Humans use the XX-XY system where XY = male. Birds use the ZZ-ZW system where ZW = female and ZZ = male. Do not apply bird genetics to humans -- NEET tests whether you know which organism uses which system.',
      tip: 'Humans/mammals = XX-XY. Birds/butterflies = ZZ-ZW. In birds, the female is heterogametic (ZW). Don\'t mix the systems!',
      conceptTag: 'sex-determination',
    },

    // ── zoo-gen-012: Codominance example (correct: a = AB blood group) ──

    {
      questionId: 'zoo-gen-012',
      selectedOptionId: 'b',
      misconception:
        'Rh factor is an example of dominance (Rh+ is dominant over Rh-), not codominance. In codominance, both alleles are equally and independently expressed in the phenotype.',
      correctReasoning:
        'In the ABO blood group, when a person has genotype I^A I^B, both A and B antigens are produced on the RBC surface. Neither dominates the other -- both are fully expressed. This is codominance. Rh factor follows simple dominance.',
      tip: 'AB blood group = codominance (both A and B antigens visible). Rh factor = simple dominance. Know the difference!',
      conceptTag: 'codominance',
    },
    {
      questionId: 'zoo-gen-012',
      selectedOptionId: 'c',
      misconception:
        'Sickle cell anemia in heterozygotes (HbA HbS) is actually an example of *incomplete dominance* at the molecular level -- both normal and sickle hemoglobin are produced. But it is not the textbook NEET example of codominance.',
      correctReasoning:
        'The classic NEET example of codominance is the AB blood group (I^A I^B), where both antigens are expressed fully and independently. Sickle cell trait in heterozygotes shows a mix at the molecular level, but ABO is the standard codominance example in NCERT.',
      tip: 'For NEET, always go with the NCERT example: Codominance = ABO blood group (AB type). Stick to the textbook answer.',
      conceptTag: 'codominance',
    },
    {
      questionId: 'zoo-gen-012',
      selectedOptionId: 'd',
      misconception:
        'Eye color in humans is a polygenic trait (controlled by multiple genes), not an example of codominance. Polygenic inheritance and codominance are different genetic phenomena.',
      correctReasoning:
        'Codominance means both alleles of a single gene are fully expressed (e.g., I^A I^B = AB blood group). Eye color is determined by multiple genes (polygenic) with complex interactions, not a single gene showing codominance.',
      tip: 'Codominance = one gene, both alleles expressed equally. Polygenic = many genes, one trait. Eye color = polygenic, not codominance.',
      conceptTag: 'codominance',
    },

    // ── zoo-gen-015: Mutation is (correct: c = sudden heritable change in DNA) ──

    {
      questionId: 'zoo-gen-015',
      selectedOptionId: 'a',
      misconception:
        'Recombination is the rearrangement of genetic material during crossing over in meiosis. It creates new allele combinations but does not change the DNA sequence itself. Mutation alters the DNA sequence.',
      correctReasoning:
        'A mutation is a sudden, permanent, and heritable change in the nucleotide sequence of DNA. Recombination shuffles existing alleles between homologous chromosomes during meiosis without changing any individual gene\'s sequence.',
      tip: 'Mutation = changes the DNA letters. Recombination = shuffles existing cards. Both create variation, but by different mechanisms.',
      conceptTag: 'mutation',
    },
    {
      questionId: 'zoo-gen-015',
      selectedOptionId: 'b',
      misconception:
        'Crossing over is the physical exchange of chromatid segments between homologous chromosomes during Prophase I of meiosis. It is a type of recombination, not a mutation.',
      correctReasoning:
        'Mutation is a change in the DNA sequence (e.g., base substitution, insertion, deletion). Crossing over is a normal meiotic event that exchanges segments between homologous chromosomes. They are fundamentally different processes.',
      tip: 'Crossing over = planned exchange during meiosis. Mutation = unplanned change in DNA. "Sudden change" is the key phrase for mutation.',
      conceptTag: 'mutation',
    },
    {
      questionId: 'zoo-gen-015',
      selectedOptionId: 'd',
      misconception:
        'Natural selection is an evolutionary process that acts on existing variation (including mutations) to favor organisms better adapted to their environment. It does not itself create new DNA changes.',
      correctReasoning:
        'Mutation creates new genetic variation by altering DNA sequences. Natural selection then acts on this variation, favoring beneficial traits. Mutation is the *raw material* for evolution; natural selection is the *filter* that shapes it.',
      tip: 'Mutation = creates variation. Natural selection = selects from variation. They work together in evolution but are different concepts.',
      conceptTag: 'mutation',
    },

    // ── zoo-gen-019: RNA differs from DNA by having (correct: b = uracil instead of thymine) ──

    {
      questionId: 'zoo-gen-019',
      selectedOptionId: 'a',
      misconception:
        'Adenine is present in BOTH DNA and RNA. The question asks what RNA has *instead of* something in DNA. Adenine is a shared base, not a distinguishing one.',
      correctReasoning:
        'RNA has uracil (U) instead of thymine (T). The four bases in DNA are A, T, G, C. The four bases in RNA are A, U, G, C. Adenine, guanine, and cytosine are common to both. Only thymine (DNA) and uracil (RNA) differ.',
      tip: 'DNA = A, T, G, C. RNA = A, U, G, C. The only swap is T<->U. Three bases are shared. Uracil is the RNA marker.',
      conceptTag: 'rna-structure',
    },
    {
      questionId: 'zoo-gen-019',
      selectedOptionId: 'c',
      misconception:
        'Cytosine is found in both DNA and RNA. It pairs with guanine in both. It is not a distinguishing feature of RNA versus DNA.',
      correctReasoning:
        'Both DNA and RNA contain cytosine (C), which pairs with guanine (G). The key difference is that RNA uses uracil (U) where DNA uses thymine (T). Both U and T pair with adenine, but structurally they differ by one methyl group.',
      tip: 'C pairs with G in both DNA and RNA. Only T (DNA) and U (RNA) differ. If the question says "differs," the answer is always uracil.',
      conceptTag: 'rna-structure',
    },
    {
      questionId: 'zoo-gen-019',
      selectedOptionId: 'd',
      misconception:
        'Guanine is present in both DNA and RNA and pairs with cytosine in both. It does not replace thymine -- uracil does.',
      correctReasoning:
        'RNA uses uracil instead of thymine. Guanine (G) is common to both nucleic acids and always pairs with cytosine (C). Additionally, RNA has ribose sugar (with -OH at 2\' carbon) instead of deoxyribose, and is usually single-stranded.',
      tip: 'Two key RNA differences: (1) uracil replaces thymine, (2) ribose replaces deoxyribose. Guanine is not the difference.',
      conceptTag: 'rna-structure',
    },

    // ── zoo-gen-023: PCR is used for (correct: d = DNA amplification) ──

    {
      questionId: 'zoo-gen-023',
      selectedOptionId: 'a',
      misconception:
        'Protein synthesis occurs on ribosomes via translation. PCR (Polymerase Chain Reaction) amplifies DNA, not proteins. The names sound technical but serve completely different functions.',
      correctReasoning:
        'PCR (Polymerase Chain Reaction) is a technique that makes millions of copies of a specific DNA segment in vitro using Taq DNA polymerase, primers, and thermal cycling (denaturation, annealing, extension). It does not synthesize proteins.',
      tip: 'PCR = Photocopier for DNA. Ribosomes = factory for proteins. PCR amplifies DNA, not protein.',
      conceptTag: 'pcr-technique',
    },
    {
      questionId: 'zoo-gen-023',
      selectedOptionId: 'b',
      misconception:
        'Cell culture is the process of growing cells in a controlled environment (in vitro), typically in a lab dish with growth medium. PCR works on isolated DNA molecules, not living cells.',
      correctReasoning:
        'PCR amplifies a specific DNA sequence outside of living cells using repeated heating and cooling cycles. Cell culture grows whole living cells in flasks. PCR needs only template DNA, primers, dNTPs, and Taq polymerase -- no living cells required.',
      tip: 'PCR = works on DNA molecules in a tube. Cell culture = grows living cells in a dish. Completely different techniques.',
      conceptTag: 'pcr-technique',
    },
    {
      questionId: 'zoo-gen-023',
      selectedOptionId: 'c',
      misconception:
        'Blood typing uses antigen-antibody reactions (antisera) on a glass slide to determine ABO and Rh groups. It is an immunological test, not a molecular biology technique like PCR.',
      correctReasoning:
        'PCR is used to amplify specific DNA sequences for applications like forensics, diagnostics, cloning, and genetic testing. Blood typing is done using specific antisera (Anti-A, Anti-B, Anti-D) and does not involve DNA amplification.',
      tip: 'PCR = DNA amplification technique. Blood typing = antigen-antibody slide test. Don\'t mix molecular biology with immunology.',
      conceptTag: 'pcr-technique',
    },
  ],
};
